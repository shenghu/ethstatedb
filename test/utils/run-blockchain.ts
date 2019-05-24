import Account from 'ethereumjs-account'
import * as ethereumUtil from 'ethereumjs-util'
import * as fs from 'fs-extra'
import leveldown from 'leveldown'
import levelup from 'levelup'
import * as util from 'util'

const ethjsUtil = require('ethjs-util')
const Trie = require('merkle-patricia-tree/secure')
const Block = require('ethereumjs-block')
const Blockchain = require('ethereumjs-blockchain')
const VM = require('ethereumjs-vm')
const level = require('level')

function format(a: any, toZero?: any, isHex?: boolean) {
  if (a === '') {
    return Buffer.alloc(0)
  }

  if (a.slice && a.slice(0, 2) === '0x') {
    a = a.slice(2)
    if (a.length % 2) a = '0' + a
    a = Buffer.from(a, 'hex')
  } else if (!isHex) {
    a = Buffer.from(new ethereumUtil.BN(a).toArray())
  } else {
    if (a.length % 2) a = '0' + a
    a = Buffer.from(a, 'hex')
  }

  if (toZero && a.toString('hex') === '') {
    a = Buffer.from([0])
  }

  return a
}

function formatBlockHeader(data: any) {
  const r: { [key: string]: any } = {}
  const keys = Object.keys(data)
  keys.forEach((key: string) => {
    r[key] = ethereumUtil.addHexPrefix(data[key])
  })

  return r
}

async function setupPreConditions(state: any, testData: any) {
  const keysOfPre = Object.keys(testData.pre)

  return Promise.all(keysOfPre.map(async (key: any) => {
    const acctData = testData.pre[key]
    const account = new Account()

    account.nonce = format(acctData.nonce)
    account.balance = format(acctData.balance)

    const storageTrie = state.copy()
    storageTrie.root = null

    const keys = Object.keys(acctData.storage)
    await Promise.all(keys.map(async (key: any) => {
      let val = acctData.storage[key]
      val = ethereumUtil.rlp.encode(Buffer.from(val.slice(2), 'hex'))
      key = ethereumUtil.setLength(Buffer.from(key.slice(2), 'hex'), 32)

      return util.promisify(storageTrie.put)(key, val)
    }))

    const codeBuf = Buffer.from(acctData.code.slice(2), 'hex')
    await new Promise((resolve, reject) => {
      account.setCode(state, codeBuf, (err: any, codeHash: Buffer) => {
        if (err) return reject(err)
        resolve(codeHash)
      })
    })

    account.stateRoot = storageTrie.root
    if (testData.exec && key === testData.exec.address) {
      testData.root = storageTrie.root
    }
    return util.promisify(state.put)(Buffer.from(ethjsUtil.stripHexPrefix(key), 'hex'), account.serialize())
  }))
}

export const enum SupportedHardforkType {
  byzantium = 'byzantium'
}

export interface BlockChainConfig {
  dbPath: string,
  validate: boolean,
  cachePath: string,
  hardfork: SupportedHardforkType
  data: any
  reset?: boolean
}

export async function runBlockchain(config: BlockChainConfig) {
  const hardfork = config.hardfork
  const validate = config.validate
  const data = config.data

  if (config.reset) {
    await Promise.all([config.dbPath, config.cachePath].map(async path => {
      if (path) {
        await fs.emptyDir(path)
      }
    }))
  }

  await Promise.all([config.dbPath, config.cachePath].map(async dir => {
    if (dir) {
      await fs.ensureDir(dir)
    }
  }))

  const db = levelup(leveldown(config.dbPath))
  const blockchain = new Blockchain({db, hardfork, validate})

  if (validate)
    blockchain.ethash.cacheDB = level(config.cachePath)

  const state = new Trie(db)
  const vm = new VM({state, blockchain, hardfork})
  data.homestead = true

  vm.on('beforeTx', (tx: any) => {
    tx._homestead = true
  })

  vm.on('beforeBlock', (block: any) => {
    block.header.isHomestead = function () {
      return true
    }
  })

  const genesisBlock = new Block({hardfork})

  // Setup pre state
  await setupPreConditions(state, data)

  // Create genesis block
  await new Promise((resolve, reject) => {
    genesisBlock.header = new Block.Header(formatBlockHeader(data.genesisBlockHeader),
      {hardfork})
    blockchain.putGenesis(genesisBlock, (err: any, value: any) => {
      if (err) reject(err)

      resolve(value)
    })
  })

  // add some following blocks
  for (const raw of data.blocks) {
    const block = new Block(Buffer.from(raw.rlp.slice(2), 'hex'))

    // forces the block into thinking they are homestead
    block.header.isHomestead = () => {
      return true
    }

    block.uncleHeaders.forEach((uncle: any) => {
      uncle.isHomestead = function () { return true }
    })

    await new Promise((resolve, reject) => {
      blockchain.putBlock(block, (err: any, result: any) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  // Run blockchain
  await new Promise((resolve, reject) => {
    vm.runBlockchain((err: any, value: any) => {
      if (err) reject(err)

      resolve(value)
    })
  })

  return vm
}

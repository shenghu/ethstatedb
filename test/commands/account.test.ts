import {expect, test} from '@oclif/test'
import * as fs from 'fs-extra'
import * as os from 'os'

import {runBlockchain, SupportedHardforkType} from '../utils/run-blockchain'

const testData = require('../fixtures/test-blockchain-data.json')

describe('account', () => {
  before(async () => {
    const evm = await runBlockchain({
      dbPath: '.db/chaindata',
      cachePath: '.db/cachedata',
      validate: true,
      data: testData,
      hardfork: SupportedHardforkType.byzantium,
      reset: true
    })
  
    await new Promise((resolve, reject) => {
      evm.blockchain.db.close((err: Error, result: any) => {
        if (err) reject(err)
  
        resolve(result)
      })
    })
  })

  test
    .stdout()
    .do(() => {
      fs.copySync('.db/chaindata', '.db/chaindata-1')
    })
    .command(['account',
      '--dbdir', '.db/chaindata-1',
      '--root', '0xecc60e00b3fe5ce9f6e1a10e5469764daf51f1fe93c22ec3f9a7583a80357217',
      '--work-dir', '.ethstatedb-1',
      '0x095e7baea6a6c7c4c2dfeb977efac326af552d87'])
    .it('runs account', async ctx => {
      const result: any = {}
      ctx.stdout.split(os.EOL).map((element: string) => {
        const tokens = element.trim().split(/\s+/)
        if (tokens.length > 1) {
          result[tokens[0]] = tokens[1]
        }
      })

      expect(result.Balance).to.equal('10')
    })

  test
    .stdout()
    .do(() => {
      fs.copySync('.db/chaindata', '.db/chaindata-2')
      fs.removeSync('.ethstatedb')
    })
    .command(['account',
      '--dbdir', '.db/chaindata-2',
      '--root', '0xecc60e00b3fe5ce9f6e1a10e5469764daf51f1fe93c22ec3f9a7583a80357217',
      '--skip-copy',
      '0x095e7baea6a6c7c4c2dfeb977efac326af552d87'])
    .it('runs account --skip-copy', async ctx => {
      const result: any = {}
      ctx.stdout.split(os.EOL).map((element: string) => {
        const tokens = element.trim().split(/\s+/)
        if (tokens.length > 1) {
          result[tokens[0]] = tokens[1]
        }
      })

      expect(result.Balance).to.equal('10')
      expect(await fs.pathExists('.ethstatedb')).to.be.false
    })
})

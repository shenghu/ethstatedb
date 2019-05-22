import {expect, test} from '@oclif/test'
import * as os from 'os'

import {BlockChainConfig, runBlockchain, SupportedHardforkType} from '../utils/run-blockchain'

const testData = require('../fixtures/test-blockchain-data.json')

const testOnEthereum = test.register('runEVM', (config: BlockChainConfig) => {
  return {
    async run(ctx: any) {
      ctx.evm = await runBlockchain(config)
    }
  }
})

describe('account', () => {
  testOnEthereum
    .runEVM({dbPath: '.db/chaindata',
      cachePath: '.db/cachedata',
      validate: true,
      data: testData,
      hardfork: SupportedHardforkType.byzantium,
      reset: true})
    .stdout()
    .do(ctx => {
      ctx.evm.blockchain.db.close()
    })
    .command(['account',
      '--dbdir', '.db/chaindata',
      '--root', '0xecc60e00b3fe5ce9f6e1a10e5469764daf51f1fe93c22ec3f9a7583a80357217', '0x095e7baea6a6c7c4c2dfeb977efac326af552d87'])
    .it('runs account', ctx => {
      const result: any = {}
      ctx.stdout.split(os.EOL).map((element: string) => {
        const tokens = element.trim().split(/\s+/)
        if (tokens.length > 1) {
          result[tokens[0]] = tokens[1]
        }
      })

      expect(result.Balance).to.equal('10')
    })
})

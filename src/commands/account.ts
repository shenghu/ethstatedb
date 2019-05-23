import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import EAccount from 'ethereumjs-account'
import {BN, KECCAK256_NULL_S, KECCAK256_RLP_S} from 'ethereumjs-util'

export default class Account extends Command {
  static description = 'load information of an account'

  static examples = [
    '$ ethstatedb account --dbdir /home/data/ethereum-node1/geth/chaindata --root 0x595e3a0db7f38600770a267b12b67a8da1c202fef4b6c21e60fdb92477d89753 0x7C476EA4e20D6d49820Ee810C0C474ED11b3f527',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    dbdir: flags.string({
      char: 'd',
      required: true,
      description:
        'path of Ethereum state database, e.g. ethereum/geth/chaindata',
    }),
    root: flags.string({
      char: 'r',
      required: true,
      description: 'value of stateRoot',
    }),
  }

  static args = [
    {
      name: 'address',
      required: true,
      description:
        'public key of an account, e.g. 0x7C476EA4e20D6d49820Ee810C0C474ED11b3f527',
    },
  ]

  async run() {
    const Trie = require('merkle-patricia-tree/secure')
    const level = require('level')

    const {args, flags} = this.parse(Account)
    const db = level(flags.dbdir)
    const trie = new Trie(db, flags.root)

    const found = await new Promise((resolve, reject) => {
      trie.checkRoot(flags.root, (err: any, value: boolean) => {
        if (err) return reject(err)

        resolve(value)
      })
    })

    if (!found) return this.warn(`stateRoot (${flags.root}) is not found in db`)

    const account: EAccount = await new Promise((resolve, reject) => {
      trie.get(args.address, (err: Error, raw: any) => {
        if (err) return reject(err)

        return resolve(new EAccount(raw))
      })
    })

    this.log('')
    this.print(args.address, account)
  }

  print(address: string, account: EAccount) {
    cli.table(
      [
        {name: 'Address', value: address},
        {
          name: 'Balance',
          value: `${new BN(account.balance).toString()}`,
        },
        {name: 'Nonce', value: `${new BN(account.nonce).toString()}`},
        {
          name: 'StateRoot',
          value: `${
            account.stateRoot.toString('hex') === KECCAK256_RLP_S
              ? ''
              : '0x' + account.stateRoot.toString('hex')
          }`,
        },
        {
          name: 'CodeHash',
          value: `${
            account.codeHash.toString('hex') === KECCAK256_NULL_S
              ? ''
              : '0x' + account.codeHash.toString('hex')
          }`,
        },
      ],
      {name: {}, value: {}},
      {printLine: this.log, 'no-header': true},
    )
  }
}

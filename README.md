ethstatedb
=====

Command to check Ethereum state database

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ethstatedb.svg)](https://npmjs.org/package/ethstatedb)
[![Downloads/week](https://img.shields.io/npm/dw/ethstatedb.svg)](https://npmjs.org/package/ethstatedb)
[![License](https://img.shields.io/npm/l/ethstatedb.svg)](https://github.com/shenghu/ethstatedb/blob/master/package.json)

This cli is created when I was studying Ethereum. I was curious about when and how an accout is created and maintained by Ethereum state database. From [Diving into Ethereum?s world state](https://medium.com/cybermiles/diving-into-ethereums-world-state-c893102030ed), it said accounts are nbot created in state database until there is a transaction for it. So I create this small tool to verify it.  

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ethstatedb
$ ethstatedb COMMAND
running command...
$ ethstatedb (-v|--version|version)
ethstatedb/0.0.1 linux-x64 node-v10.15.3
$ ethstatedb --help [COMMAND]
USAGE
  $ ethstatedb COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ethstatedb account ADDRESS`](#ethstatedb-account-address)
* [`ethstatedb help [COMMAND]`](#ethstatedb-help-command)

## `ethstatedb account ADDRESS`

Load information of an account

```
USAGE
  $ ethstatedb account ADDRESS

ARGUMENTS
  ADDRESS  public key of an account, e.g. 0x7C476EA4e20D6d49820Ee810C0C474ED11b3f527

OPTIONS
  -d, --dbdir=dbdir  (required) path of Ethereum state database, e.g. ethereum/geth/chaindata
  -h, --help         show CLI help
  -r, --root=root    (required) value of stateRoot

EXAMPLE
  $ ethstatedb account --dbdir /home/data/ethereum-node1/geth/chaindata --root 
  0x595e3a0db7f38600770a267b12b67a8da1c202fef4b6c21e60fdb92477d89753 0x7C476EA4e20D6d49820Ee810C0C474ED11b3f527
```

_See code: [src/commands/account.ts](https://github.com/shenghu/ethstatedb/blob/v0.0.1/src/commands/account.ts)_

## `ethstatedb help [COMMAND]`

display help for ethstatedb

```
USAGE
  $ ethstatedb help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->

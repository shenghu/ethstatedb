ethstatedb
=====

Command to check Ethereum state database

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ethstatedb.svg)](https://npmjs.org/package/ethstatedb)
[![Downloads/week](https://img.shields.io/npm/dw/ethstatedb.svg)](https://npmjs.org/package/ethstatedb)
[![License](https://img.shields.io/npm/l/ethstatedb.svg)](https://github.com/shenghu/ethstatedb/blob/master/package.json)
[![CircleCI](https://circleci.com/gh/shenghu/ethstatedb.svg?style=svg)](https://circleci.com/gh/shenghu/ethstatedb)
[![Coverage Status](https://coveralls.io/repos/github/shenghu/ethstatedb/badge.svg?branch=master)](https://coveralls.io/github/shenghu/ethstatedb?branch=master)

This cli is created when I was studying Ethereum. I was curious about when and how an accout is created and maintained by Ethereum state database. From [Diving into Ethereum?s world state](https://medium.com/cybermiles/diving-into-ethereums-world-state-c893102030ed), it said accounts are nbot created in state database until there is a transaction for it. So I create this small tool to verify it.  

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ethstatedb

$ ethstatedb account -d .db/chaindata/ -r 0xecc60e00b3fe5ce9f6e1a10e5469764daf51f1fe93c22ec3f9a7583a80357217 0x095e7baea6a6c7c4c2dfeb977efac326af552

Address   0x095e7baea6a6c7c4c2dfeb977efac326af552 
Balance   0                                       
Nonce     0                                       
StateRoot                                         
CodeHash 
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ethstatedb account [ADDRESS]`](#ethstatedb-account)
* [`ethstatedb help`](#ethstatedb-help)

## `ethstatedb account [ADDRESS]`

Retrieve account information from Ethereum state database

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



## `ethstatedb help`

Display help for ethstatedb

```
Command to check Ethereum state database

VERSION
  ethstatedb/0.0.1 linux-x64 node-v10.15.3

USAGE
  $ ethstatedb [COMMAND]

COMMANDS
  account  Load information of an account
  help     display help for ethstatedb
```
<!-- commandsstop -->

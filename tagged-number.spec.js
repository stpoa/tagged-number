const _ = require('./')
const assert = require('assert')
const BigNumber = require('bignumber.js')
const bn = n => new BigNumber(n)


const num = bn(100)

assert.deepEqual(_`(8 + 2)`, bn(10))

assert.deepEqual(_`(1 + 2 * 3)`, bn(7))

assert.deepEqual(_`(1+2+3+4+5)`, bn(15))

assert.deepEqual(_`(1 + ${num} * 2)`, bn(201))

assert.deepEqual(_`(${num} * 10e11)`.toString(), bn(10e13).toString())

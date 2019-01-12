/*
 * promisified-resource-loader test file
 *
 * Copyright 2018, Vasyl Khrystiuk
 * https://k.co.ua
 *
 * Licensed under Apache License 2.0
 * So you'd probably to keep this header here.
 * I love trains!
 */

/* eslint no-unused-vars: [ 2, { "varsIgnorePattern": "should" }] */
var chai, chaiAsPromised, spies, Bus, delay, should
var isBrowser = this.window === this
if (!isBrowser) {
  chai = require('chai')
  chaiAsPromised = require('chai-as-promised')
  spies = require('chai-spies')
  chai.use(spies)
  Bus = require('./../index')
  delay = require('timeout-as-promise')
  chai.use(chaiAsPromised)
}

should = chai.should()

var bus

afterEach(function () {
})

describe('sync factory for string key', function () {
  beforeEach(function () {
    bus = new Bus(function (name) {
      switch (name) {
        case 'good':
          return 'here s: ' + name
        case 'better':
          return 'here s better: ' + name
        default:
          throw new Error('this is error message')
      }
    })
  })

  var goodKey = 'good'
  var goodExpected = 'here s: good'
  var badKey = 'bad'

  it('sync loading should be ok', function (done) {
    bus.subscribe(goodKey).should.eventually.equal(goodExpected).notify(done)
  })

  it('sync loading should not trigger more loadings for same name', async function () {
    chai.spy.on(bus, 'factory')
    bus.subscribe(goodKey).should.eventually.equal(goodExpected)
    bus.subscribe(goodKey).should.eventually.equal(goodExpected)
    bus.factory.should.have.been.called.once
    await bus.subscribe(goodKey)
    bus.factory.should.have.been.called.once
  })

  it('sync loading should fail', async function () {
    await bus.subscribe(badKey).should.eventually.rejectedWith(/this is error message/, 'should fail')
  })

  it('different keys should trigger two loadings', async function () {
    chai.spy.on(bus, 'factory')
    await bus.subscribe('good')
    await bus.subscribe('better')
    bus.factory.should.have.been.called.twice
  })
})

describe('async factory cases', function () {
  beforeEach(function () {
    bus = new Bus(async function (name) {
      await delay(30)
      switch (name) {
        case 'good':
          return 'fine then'
        case 'bad':
          throw new Error('error case')
      }
    })
    bus.loadingTimeout = 5000
  })

  it('async loading OK', async function () {
    await bus.subscribe('good').should.eventually.eq('fine then')
  })

  it('async multiple call meanwhile OK', async function () {
    chai.spy.on(bus, 'factory')
    bus.subscribe('good').should.eventually.eq('fine then')
    bus.subscribe('good').should.eventually.eq('fine then')
    bus.factory.should.have.been.called.once
    await bus.subscribe('good')
    await bus.subscribe('good')
    bus.factory.should.have.been.called.once
  })

  it('async loading error are not cached', async function () {
    chai.spy.on(bus, 'factory')
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    bus.factory.should.have.been.called.once
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    bus.factory.should.have.been.called.twice
  })

  it('async loading sync error(in factory implementation)', async function () {
    bus = new Bus(function () {
      throw new Error('error in factory method')
    })
    chai.spy.on(bus, 'factory')

    await Promise.all([
      bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/),
      bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/)
    ])
    bus.factory.should.have.been.called.once
    await bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/)
    bus.factory.should.have.been.called.twice
  })

  it('timeout error must be in usual promise flow', async function () {
    bus.loadingTimeout = 10
    await bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
  })

  it('timeout error must be in usual promise flow multiple times', async function () {
    bus.loadingTimeout = 10
    chai.spy.on(bus, 'factory')
    await bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
    bus.factory.should.have.been.called.once
    await Promise.all([
      bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError'),
      bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
    ])

    bus.factory.should.have.been.called.twice
  })

  it('underlying error(like transport error 404 and 501) must be in usual promise flow, error details must be delivered as is', async function () {
    var err
    try {
      a.b.c // eslint-disable-line
    } catch (e) {
      err = e
    }

    bus = new Bus(async function () {
      await delay()
      throw err
    })

    try {
      await bus.subscribe('any')
    } catch (e) {
      err.should.equals(e)
    }
  })
})

describe('async error handler exists', function () {
  beforeEach(function () {
    bus = new Bus(async function (name) {
      await delay()
      switch (name) {
        case 'good':
          return 'fine then'
        case 'bad':
          throw new Error('error case')
      }
    })
    bus.loadingTimeout = 5000
  })

  it('global error handler should not be called if no error', async function () {
    bus.withErrorHandler(async function (error, name) { // eslint-disable-line no-unused-vars, handle-callback-err
      await should.fail('should not be called')
    })
    await bus.subscribe('good')
  })

  it('global error handler should be called if error', async function () {
    let spyHandler = chai.spy(function (error, name) { // eslint-disable-line no-unused-vars
      return error
    })
    bus.withErrorHandler(spyHandler)
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    spyHandler.should.have.been.called()
  })

  it('doing nothing in special timeout should raise error', async function () {
    let spyHandler = chai.spy(function (error, name) { // eslint-disable-line no-unused-vars, handle-callback-err
      return delay(500)
    })
    bus.loadingTimeout = 50
    bus.errorHandlerTimeOut = 150
    bus.withErrorHandler(spyHandler)
    await bus.subscribe('bad').should.eventually.rejectedWith(/Timeout/)
    spyHandler.should.have.been.called()
  })

  it('doing long in special timeout when the timeout is negative should not raise error', async function () {
    bus.loadingTimeout = 50
    bus.errorHandlerTimeOut = -1
    bus.withErrorHandler(function (error, name) { // eslint-disable-line no-unused-vars, handle-callback-err
      return delay(200)
    })
    var spy = chai.spy(function () {
      return Promise.resolve()
    })
    await bus.subscribe({ bad: true }).then(spy)
    spy.should.have.been.called()
  })

  it('on error error handler should use another name and success', async function () {
    bus.withErrorHandler(function (error, name) { // eslint-disable-line handle-callback-err
      name.should.eq('bad')
      return bus.subscribe('good')
    })
    await bus.subscribe('bad').should.eventually.eq('fine then')
  })

  it('on error error handler should use static existing value', async function () {
    bus.withErrorHandler(function (error, name) { // eslint-disable-line handle-callback-err
      name.should.eq('bad')
      return 'perfect!'
    })
    await bus.subscribe('bad').should.eventually.eq('perfect!')
  })

  it('on error error handler should reject with custom error', async function () {
    bus.withErrorHandler(function (error, name) { // eslint-disable-line handle-callback-err
      name.should.eq('bad')
      throw new Error('oh no!')
    })
    await bus.subscribe('bad').should.eventually.rejectedWith(/oh no!/)
  })
})

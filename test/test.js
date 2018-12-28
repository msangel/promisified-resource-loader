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

/* global window, beforeEach, afterEach, describe, it */
var chai, chaiAsPromised, spies, Bus, delay, should
const isBrowser = this.window === this
if (!isBrowser) {
  chai = require('chai')
  chaiAsPromised = require('chai-as-promised')
  spies = require('chai-spies')
  chai.use(spies)
  Bus = require('./../index');
  delay = require('timeout-as-promise');
} else {
  delay = window.timeoutAsPromise;
}

chai.use(chaiAsPromised)
should = chai.should()


'use strict'

var bus


afterEach(function () {
})

describe('sync factory for string key', function () {
  beforeEach(function () {
    bus = new Bus(function (name) {
      switch (name) {
        case 'good':
          return "here s: " + name
        default:
          throw new Error('this is error message');
      }

    });
  })

  it('sync loading should be ok', function (done) {
    bus.subscribe('good').should.eventually.equal('here s: good').notify(done)
  })

  it('sync loading should not trigger more loadings for same name', async function () {
    chai.spy.on(bus, 'factory');
    bus.subscribe('good').should.eventually.equal('here s: good')
    bus.subscribe('good').should.eventually.equal('here s: good')
    bus.factory.should.have.been.called.once
    await bus.subscribe('good')
    bus.factory.should.have.been.called.once
  })

  it('sync loading should fail', function (done) {
    bus.subscribe('bad').should.eventually.rejectedWith(/this is error message/).notify(done)
  })
})

describe('sync factory for object key', function () {
  beforeEach(function () {
    bus = new Bus(function (name) {
      if(name.good){
        return "here s: good with:"+ name.payload
      } else if(name.cat){
        return "cat is good"
      } else {
        throw new Error('this is error message');
      }
    });
  })

  it('sync loading should be ok', function (done) {
    bus.subscribe({good: true, payload: 'ok'}).should.eventually.equal('here s: good with:ok').notify(done)
  })

  it('sync loading should fail', function (done) {
    bus.subscribe({error:true}).should.eventually.rejectedWith(/this is error message/, "should fail").notify(done)
  })

  it('object as a key should not trigger two loadings for equal objects', function (done) {
    chai.spy.on(bus, 'factory');

    bus.subscribe({unicorn:'rainbow', cat: 'is fine too'})
    bus.subscribe({cat: 'is fine too', unicorn:'rainbow'})

    bus.factory.should.have.been.called.once
    bus.subscribe({cat: 'is fine too', unicorn:'rainbow'}).then(function () {
      bus.factory.should.have.been.called.once
      bus.subscribe({cat: 'is fine too', unicorn:'rainbow'}).should.eventually.notify(done)
    })
  })

  it('object as a key should trigger two loadings for different objects', function (done) {
    chai.spy.on(bus, 'factory');

    bus.subscribe({unicorn:'rainbow!!!', cat: 'is fine too'})
    bus.subscribe({cat: 'is fine too', unicorn:'rainbow'})

    bus.factory.should.have.been.called.twice
    bus.subscribe({cat: 'is fine too', unicorn:'rainbow'}).should.eventually.notify(done)
  })
})

describe('async factory for string key', function () {
  beforeEach(function () {
    bus = new Bus(async function (name) {
      await delay(30)
      switch (name) {
        case 'good': return 'fine then'
        case 'bad': throw new Error('error case')
      }
    });
    bus.loadingTimeout = 5000
  })

  it('async loading OK', async function () {
    bus.subscribe('good').should.eventually.eq('fine then')
  })

  it('async multiple call meanwhile OK', async function () {
    chai.spy.on(bus, 'factory');
    bus.subscribe('good').should.eventually.eq('fine then')
    bus.subscribe('good').should.eventually.eq('fine then')
    bus.factory.should.have.been.called.once
    await bus.subscribe('good')
    await bus.subscribe('good')
    bus.factory.should.have.been.called.once
  })

  it('async loading error are not cached', async function () {
    chai.spy.on(bus, 'factory');
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    bus.factory.should.have.been.called.once
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    bus.factory.should.have.been.called.twice
  })

  it('async loading sync error(in factory implementation)', async function () {
    bus = new Bus(function (name) {
      throw new Error('error in factory method')
    });
    chai.spy.on(bus, 'factory');

    await Promise.all([
        bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/)
      , bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/)
    ])
    bus.factory.should.have.been.called.once
    await bus.subscribe('any').should.eventually.rejectedWith(/error in factory method/)
    bus.factory.should.have.been.called.twice
  })

  it('timeout error must be in usual promise flow', async function () {
    bus.loadingTimeout = 10
    bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
  })

  it('timeout error must be in usual promise flow multiple times', async function () {
    bus.loadingTimeout = 10
    chai.spy.on(bus, 'factory');
    await bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
    bus.factory.should.have.been.called.once
    await Promise.all([
      bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
      , bus.subscribe('any').should.eventually.rejectedWith(Error).and.have.property('name', 'TimeoutError')
    ])

    bus.factory.should.have.been.called.twice
  })

  it('underlying error(like transport error 404 and 501) must be in usual promise flow, error details must be delivered as is', async function () {
    var err;
    try{
      a.b.c
    } catch (e) {
      err = e
    }

    bus = new Bus(async function (name) {
      await delay()
      throw err
    });

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
        case 'good': return 'fine then'
        case 'bad': throw new Error('error case')
      }
    })
    bus.loadingTimeout = 5000
  })

  it('global error handler should not be called if no error', async function () {
    bus.withErrorHandler(function (error, resolve, reject, name) {
      should.fail("should not be called")
    })
    await bus.subscribe('good')
  })

  it('global error handler should be called if error', async function () {
    let spyHandler = chai.spy(function (error, resolve, reject, name) {
      reject(error)
    })
    bus.withErrorHandler(spyHandler)
    await bus.subscribe('bad').should.eventually.rejectedWith(/error case/)
    spyHandler.should.have.been.called()
  })

  it('doing nothing in special timeout should raise error', async function () {
    let spyHandler = chai.spy(function (error, resolve, reject, name) {

    })
    bus.loadingTimeout = 50
    bus.errorHandlerTimeOut = 150
    bus.withErrorHandler(spyHandler)
    await bus.subscribe('bad').should.eventually.rejectedWith(/Timeout/)
    spyHandler.should.have.been.called()
  })

  it('doing nothing in special timeout when the timeout is negative should not raise error', async function () {
    bus.loadingTimeout = 50
    bus.errorHandlerTimeOut = -1
    bus.withErrorHandler(function (error, resolve, reject, name) {
      // never do this
    })
    var spy = chai.spy(function () {
      return Promise.resolve()
    })
    await Promise.race([bus.subscribe('bad'), delay(200).then(spy)])
    spy.should.have.been.called()
  })

  it('on error error handler should use another name and success', async function () {
    bus.withErrorHandler(function (error, resolve, reject, name) {
      name.should.eq('bad')
      bus.subscribe('good').then(resolve)
    })
    await bus.subscribe('bad').should.eventually.eq('fine then')
  })

  it('on error error handler should use static existing value', async function () {
    bus.withErrorHandler(function (error, resolve, reject, name) {
      name.should.eq('bad')
      resolve('perfect!')
    })
    await bus.subscribe('bad').should.eventually.eq('perfect!')
  })

  it('on error error handler should reject with custom error', async function () {
    bus.withErrorHandler(function (error, resolve, reject, name) {
      name.should.eq('bad')
      reject(new Error('oh no!'))
    })
    await bus.subscribe('bad').should.eventually.rejectedWith(/oh no!/)
  })
})

describe('some async scenarios for object key', function () {

  beforeEach(function () {
    bus = new Bus(async function (name) {
      await delay()
      if(name.good){
        return 'fine then'
      } else if(name.bad) {
        throw new Error('error case')
      }
    })
    bus.loadingTimeout = 5000
  })

})

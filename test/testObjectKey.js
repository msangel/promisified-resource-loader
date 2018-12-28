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


describe('sync factory for object key', function () {
  beforeEach(function () {
    bus = new Bus(function (name) {
      if (name.good) {
        return "here s: good with:" + name.payload
      } else if (name.cat) {
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
    bus.subscribe({error: true}).should.eventually.rejectedWith(/this is error message/, "should fail").notify(done)
  })

  it('object as a key should not trigger two loadings for equal objects', function (done) {
    chai.spy.on(bus, 'factory');

    bus.subscribe({unicorn: 'rainbow', cat: 'is fine too'})
    bus.subscribe({cat: 'is fine too', unicorn: 'rainbow'})

    bus.factory.should.have.been.called.once
    bus.subscribe({cat: 'is fine too', unicorn: 'rainbow'}).then(function () {
      bus.factory.should.have.been.called.once
      bus.subscribe({cat: 'is fine too', unicorn: 'rainbow'}).should.eventually.notify(done)
    })
  })

  it('object as a key should trigger two loadings for different objects', function (done) {
    chai.spy.on(bus, 'factory');

    bus.subscribe({unicorn: 'rainbow!!!', cat: 'is fine too'})
    bus.subscribe({cat: 'is fine too', unicorn: 'rainbow'})

    bus.factory.should.have.been.called.twice
    bus.subscribe({cat: 'is fine too', unicorn: 'rainbow'}).should.eventually.notify(done)
  })
})

describe('some async scenarios for object key', function () {

  beforeEach(function () {
    bus = new Bus(async function (name) {
      await delay()
      if (name.good) {
        return 'fine then'
      } else if (name.bad) {
        throw new Error('error case')
      }
    })
    bus.loadingTimeout = 5000
  })

})
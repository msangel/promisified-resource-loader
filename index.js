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
(function () {

  var pt, sha1;
  var isBrowser = this.window === this
  if (isBrowser) {
    pt = window.promiseTimeout
    sha1 = window.jsonHash.digest
  } else {
    pt = require('promise-timeout')
    sha1 = require('json-hash').digest
  }

  function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }

  function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String)
  }

  function getAsString(val) {
    if(isString(val)){
      return val;
    } else {
      return sha1(val)
    }
  }

  var Bus = function (factory) {
    var me = this
    me.factory = factory || function (name) {
      return Promise.reject(new Error('must be implementing'))
    }
    me.ev = {}
    me.cache = {}
    me.subscribe = function (name) {
      console.log('subscribe on: ', name)

      var key = getAsString(name);

      console.log('me.cache[name]: ', me.cache[key])
      if (me.cache[key]) {
        return Promise.resolve(me.cache[key])
      } else {
        var mResolve, mReject;
        var f = function (data, error) {
          if(!error){
            me.cache[key] = data
            mResolve(data)
          } else {
            mReject(error)
          }
        }

        if (typeof me.ev[key] === 'undefined') {
          startLoading(name)
        }

        me.ev[key] = me.ev[key] || []
        me.ev[key].push(f)
        return new Promise(function (resolve, reject) {
          mResolve = resolve
          mReject = reject
        })
      }
    }
    var publishSuccess = function (name, template) {
      var key = getAsString(name);
      me.ev[key] = me.ev[key] || []
      for (let i = 0; i < me.ev[key].length; i++) {
        me.ev[key][i](template)
      }
      me.ev[key] = []
    }

    var publishError = function (name, error) {
      var key = getAsString(name);
      me.ev[key] = me.ev[key] || []
      for (let i = 0; i < me.ev[key].length; i++) {
        me.ev[key][i](false, error)
      }
      delete me.ev[key]
    }

    me.loadingTimeout = 5000
    me.errorHandlerTimeOut = 5000
    var startLoading = function (name) {
      var factoryResult
      try{
        factoryResult = me.factory(name);
        if (!isPromise(factoryResult)) {
          factoryResult = Promise.resolve(factoryResult)
        }
      } catch (e) {
        factoryResult = Promise.reject(e)
      }

      pt.timeout(factoryResult, me.loadingTimeout)
        .then(function (template) {
          publishSuccess(name, template)
        }).catch(function (err) {
          return pt.timeout(
            new Promise(function (resolve, reject) {
              me.errorHandler(err, resolve, reject, name)
            }),
            me.errorHandlerTimeOut
          ).then(function (template) {
            publishSuccess(name, template)
          })
      }).catch(function (err) {
        publishError(name, err)
      })
    }

    me.errorHandler = function (error, resolve, reject, name){
      reject(error)
    }
    me.setErrorHandler = function (f) {
      me.errorHandler = f;
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Bus;
  } else {
    window.Bus = Bus;
  }
})();
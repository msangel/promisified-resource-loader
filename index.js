(function () {
  var Bus = function (factory) {
    var me = this
    me.factory = factory || function (name) {
      return Promise.reject(new Error('must be implementing'))
    }
    me.ev = {}
    me.cache = {}
    me.subscribe = function (name) {
      console.log('subscribe on: ', name)
      console.log('me.cache[name]: ', me.cache[name])
      if (me.cache[name]) {
        return Promise.resolve(me.cache[name])
      } else {
        var accept
        var f = function (data) {
          me.cache[name] = data
          accept(data)
        }
        if (typeof me.ev[name] === 'undefined') {
          startLoading(name)
        }
        me.ev[name] = me.ev[name] || []
        me.ev[name].push(f)
        return new Promise(function (resolve, reject) {
          accept = resolve
        })
      }
    }
    var publish = function (name, template) {
      me.ev[name] = me.ev[name] || []
      for (let i = 0; i < me.ev[name].length; i++) {
        me.ev[name][i](template)
      }
      me.ev[name] = []
    }

    me.loadingTimeout = 5000
    me.loadingTimeoutHandler = function (accept, reject, name) {
      reject(new Error('loading of ' + name + ' takes too long'))
    }

    var startLoading = function (name) {
      var timeoutHandler
      Promise.race([
        me.factory(name),
        new Promise(function (resolve, reject) {
          timeoutHandler = setTimeout(function () {
            me.loadingTimeoutHandler(resolve, reject, name)
          }, me.loadingTimeout)
        })
      ]).then(function (template) {
        if (timeoutHandler) {
          clearTimeout(timeoutHandler)
        }
        publish(name, template)
      })
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Bus;
  else
    window.Bus = Bus;
})();
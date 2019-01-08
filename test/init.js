/* eslint no-unused-vars: 0 */
/* global delay:true, chai, chaiAsPromised */
var isBrowser = this.window === this
if (isBrowser) {
  delay = window.timeoutAsPromise
  chai.use(chaiAsPromised)
}

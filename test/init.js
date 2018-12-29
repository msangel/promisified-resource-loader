var isBrowser = this.window === this
if(isBrowser){
    delay = window.timeoutAsPromise
    chai.use(chaiAsPromised)
}

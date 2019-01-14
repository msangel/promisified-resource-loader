# promisified-resource-loader
[![Build Status](https://travis-ci.org/msangel/promisified-resource-loader.svg?branch=master)](https://travis-ci.org/msangel/promisified-resource-loader)
[![Coverage Status](https://coveralls.io/repos/github/msangel/promisified-resource-loader/badge.svg?branch=master)](https://coveralls.io/github/msangel/promisified-resource-loader?branch=master)


TODO list:
- [x] replace custom promise timeout with https://github.com/building5/promise-timeout#readme
- [x] [enable eslint](https://eslint.org/docs/user-guide/configuring)
- [x] error resolving strategies 
  - [x] by default all errors are going to redirect to target promise error case(including timeout) `(err) => {if(err.isTimeOutError){}}`
  - [x] possibility to set global async error handler with signature ` (error, name) => Promise`
- [x] test cases
  - [x] sync loading OK (name/object)
  - [x] sync loading error (name/object)
  - [x] async loading OK
  - [x] async multiple call meanwhile OK
  - [x] async loading error
  - [x] async loading sync error(in factory implementation)
  - [x] timeout error must be in usual promise flow
  - [x] underlying error(like transport error 404 and 501) must be in usual promise flow, error details must be delivered as is
  - [x] global async error handler exists 
    - [x] doing nothing in special timeout should raise error
    - [x] doing nothing in special timeout -1 should not raise error
    - [x] accept with another value
        - [x] retry with another name
        - [x] use static existing value (most popular case - existing "show error" resource)
    - [x] reject with custom error
  - [x] use string `name` together with `{ id: "someId", someDataLikeHostOEtc: "localhost", lang: "RU"}` as a key
- [x] error handler should accept `error, name` and return promise (if it is spring - the result will be wrapped with Promise.resolve(), otherwise wrapped with Promise.reject())
- [ ] eviction strategies: fixed pool(lru) and time-based eviction (peek one of):
  - [ ] https://github.com/rstuven/node-cachai
  - [ ] https://www.npmjs.com/search?q=LRU
- [ ] documentation
  - [ ] sample with api
- [ ] node support
- [ ] as far as using objects as a keys require external library, this possibility should be pluggable, like: `<script src="./promisified-resource-loader-support-object-keys.js"></script>`  
- [x] proper bundle with https://github.com/DefinitelyTyped/DefinitelyTyped
- [ ] npm publish
- [ ] features: replace eval with safer version (options here: 1) sandboxed eval; 2) template function like mustache.js) 
     
     https://github.com/sindresorhus/crypto-hash#readme

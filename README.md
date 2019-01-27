# promisified-resource-loader
[![Build Status](https://travis-ci.org/msangel/promisified-resource-loader.svg?branch=master)](https://travis-ci.org/msangel/promisified-resource-loader)
[![Coverage Status](https://coveralls.io/repos/github/msangel/promisified-resource-loader/badge.svg?branch=master)](https://coveralls.io/github/msangel/promisified-resource-loader?branch=master)

Resource cache loader that return a Promise on resource call. Once resource is loaded the Promise will resolved and the result will stored in cache. Every new calls with same key will use cached value. Even concurrent requests that will made during first request processing will not trigger new loading requests and will resolve together with the first. All you need to do is write your own loading function! Minimal version in 4KB supports only strings as a key but here is also an extension that allow using objects as a keys too.

## Getting Started
### Installing
```bash
npm i -s promisified-resource-loader
```
### Using
```js
alert('sdsdsd')
```

## Maintenance
### Features to add
- [ ] as far as using objects as a keys require external library, this possibility should be pluggable, like: `<script src="./promisified-resource-loader-support-object-keys.js"></script>`
	- [ ] https://github.com/sindresorhus/crypto-hash#readme
- [ ] node support
- [ ] better documentation
  - [ ] sample with api
- [ ] npm publish (1.0 release)
- [ ] eviction strategies: fixed pool(lru) and time-based eviction (peek one of):
  - [ ] https://github.com/rstuven/node-cachai
  - [ ] https://www.npmjs.com/search?q=LRU
- [ ] replace eval with safer version, options here:
	- [ ] sandboxed eval
	- [ ] template function like mustache.js
### Existed test coverage scenarios
- [x] sync loading OK
- [x] sync loading error
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
- [x] error handler should accept `error, name` and return promise (if it is string - the result will be wrapped with Promise.resolve(), otherwise wrapped with Promise.reject())

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. 
In short: you can use this project in any way you want just make sure to keep the header of each file unchanged and notice fact of modification somewhere in changed files. And you cannot use this project's name for your own. 

## Acknowledgments
джва года ждал на такой проект

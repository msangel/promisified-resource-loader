# promisified-resource-loader

TODO list:
- [x] replace custom promise timeout with https://github.com/building5/promise-timeout#readme
- [ ] [enable eslint](https://eslint.org/docs/user-guide/configuring)
- [ ] error resolving strategies 
  - [x] by default all errors are going to redirect to target promise error case(including timeout) `(err) => {if(err.isTimeOutError){}}`
  - [x] possibility to set global async error handler with signature `(error, resolve, reject, name)`
- [ ] test cases
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
  - [ ] use string `name` together with `{ id: "someId", someDataLikeHostOEtc: "localhost", lang: "RU"}` as a key
- [ ] error handler should accept `error, name` and return promise (if it is not promise - the result will be wrapped with Promise.resolve())
- [ ] node support 
- [ ] as far as using objects as a keys require external library, this possibility should be pluggable, like: `<script src="./promisified-resource-loader-support-object-keys.js"></script>`  
- [ ] documentation
- [ ] proper bundle with https://github.com/DefinitelyTyped/DefinitelyTyped
- [ ] npm publish
     
     
     https://github.com/sindresorhus/crypto-hash#readme
  
  

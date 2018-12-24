# promisified-resource-loader

TODO list:
- [x] replace custom promise timeout with https://github.com/building5/promise-timeout#readme
- [ ] error resolving strategies 
  - [x] by default all errors are going to redirect to target promise error case(including timeout) `(err) => {if(err.isTimeOutError){}}`
  - [x] possibility to set global async error handler with signature `(error, resolve, reject, name)`
- [ ] test cases
  - [x] sync loading OK (name/object)
  - [x] sync loading error (name/object)
  - [ ] async loading OK
  - [ ] async multiple call meanwhile OK
  - [ ] async loading error
  - [ ] async loading sync error(in factory implementation)
  - [ ] timeout error must be in usual promise flow
  - [ ] transport error(let use 404 and 501) must be in usual promise flow, error detail must be delivered as is
  - [ ] global async error handler exists 
    - [ ] doing nothing in special timeout should print warning
    - [ ] accept with another value
        - [ ] retry with another name
        - [ ] use static existing value (most popular case - existing "show error" resource)
    - [ ] reject with custom error
  - [ ] use string `name` together with `{ id: "someId", someDataLikeHostOEtc: "localhost", lang: "RU"}` as a key
- [ ] node support   
- [ ] documentation
- [ ] npm publish
     
  
  
  

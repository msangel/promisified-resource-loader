# promisified-resource-loader

TODO list:
- [ ] replace `name` with `identifier` as we accent not only strings but arbitrary objects too
- [ ] error resolving strategies 
  - [ ] by default all errors are going to redirect to target promise error case(including timeout) `(err) => {if(err.isTimeOutError){}}`
  - [ ] possibility to set global async error handler with signature `(error, resolve, reject, name)`
- [ ] test cases
  - [ ] sync loading OK
  - [ ] sync multiple call meanwhile (use big file or "slow connection" emulating like https://www.npmjs.com/package/json-server or https://github.com/cortesi/devd) OK
  - [ ] sync loading error
  - [ ] async loading OK
  - [ ] async multiple call meanwhile OK
  - [ ] timeout error must be in usual promise flow
  - [ ] transport error(let use 404 and 501) must be in usual promise flow, error detail must be delivered as is
  - [ ] global async error handler exists 
    - [ ] doing nothing in special timeout should print warning
    - [ ] accept with another value
        - [ ] retry with another name
        - [ ] use static existing value (most popular case - existing "show error" resource)
    - [ ] reject with custom error
  - [ ] use string `name` together with `{ id: "someId", someDataLikeHostOEtc: "localhost", lang: "RU"}` as a key 
- [ ] documentation
- [ ] npm publish
     
  
  
  

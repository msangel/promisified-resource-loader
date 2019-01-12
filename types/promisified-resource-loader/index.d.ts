// Type definitions for promisified-resource-loader 1.0.0
// Project: https://github.com/msangel/promisified-resource-loader
// Definitions by: Vasyl Khrystiuk <https://github.com/msangel/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface Bus {
    factory: (name: string|object)=>undefined
    subscribe: (name: string|object) => Promise<any>
    loadingTimeout: number
    errorHandlerTimeOut: number
    withErrorHandler: (fun: (error: Error, name: string| object )=>undefined) => Bus
}
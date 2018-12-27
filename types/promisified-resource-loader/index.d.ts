// Type definitions for promisified-resource-loader 1.0.0
// Project: https://github.com/baz/foo (Does not have to be to GitHub, but prefer linking to a source code repository rather than to a project website.)
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface Bus {
    factory: (name: string|object)=>undefined
    subscribe: (name: string|object) => Promise<any>
    loadingTimeout: number
    errorHandlerTimeOut: number
    withErrorHandler: (fun: (error: Error, resolve: (value: any)=>undefined, reject: (value: any)=>undefined , name: string| object )=>undefined) => Bus
}
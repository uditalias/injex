export interface IDictionary<T = any> {
    [index: string]: T
}

export type IConstructor<T = any> = new(...args: any[]) => T;
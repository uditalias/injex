export interface IDictionary<T = any> {
    [index: string]: T
}

export interface IConstructor<T = any> {
    new(...args: any[]): T;
}
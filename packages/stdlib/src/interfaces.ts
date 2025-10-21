export interface IDictionary<T = any> {
    [index: string]: T
}

// Using any to support both regular and abstract constructors
// TC39 decorators don't work well with strict constructor types
export type IConstructor<T = any> = any;
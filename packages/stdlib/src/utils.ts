export function toCamelCase(str: string): string {
    return str[0].toLowerCase() + str.slice(1);
}

export function isFunction(predicate: any): boolean {
    return typeof predicate === "function";
}

export function isPromise(predicate: any): boolean {
    return !!predicate && typeof predicate === "object" && isFunction(predicate.then) && isFunction(predicate.catch);
}

export function getConstructorName(instance: any): string {
    return (instance && instance.constructor && instance.constructor.name);
}

export function yieldToMain(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
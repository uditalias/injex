export function toCamelCase(str: string): string {
    return str[0].toLowerCase() + str.slice(1);
}

export function isFunction(predicate: any): boolean {
    return typeof predicate === "function";
}

export function getConstructorName(instance: any): string {
    return (instance && instance.constructor && instance.constructor.name);
}
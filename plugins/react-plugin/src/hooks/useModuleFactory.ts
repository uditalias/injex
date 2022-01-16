import * as React from "react";
import { Factory } from "@injex/core";
import { useInjex } from "./useInjex";

/**
 * Create a module<T> instance using a factory method
 *
 * @returns Instance of module<T>
 */
export function useModuleFactory<T>(moduleName: string, args: any[] = [], memoDependencies: any[] = []): T {
    const [inject] = useInjex();
    const factoryMethod = inject<Factory<T>>(moduleName);
    return React.useMemo(() => factoryMethod(...args), memoDependencies);
}
import { useContext, useMemo } from "react";
import InjexContext from "../InjexContext";
import { IInjexContext, Inject, InjectAlias } from "../interfaces";

export function useInjex(): [Inject, InjectAlias] {
    const context = useContext<IInjexContext>(InjexContext);

    return useMemo<[Inject, InjectAlias]>(() => [context.inject, context.injectAlias], []);
}
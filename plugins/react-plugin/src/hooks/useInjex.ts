import * as React from "react";
import InjexContext from "../InjexContext";
import { IInjexContext, Inject, InjectAlias } from "../interfaces";

/**
 * Access to Injex `inject` and `injectAlias` decorators
 * inside a React component to inject container dependencies.
 *
 * @returns [Inject, InjectAlias]
 */
export function useInjex(): [Inject, InjectAlias] {
    const context = React.useContext<IInjexContext>(InjexContext);

    return React.useMemo<[Inject, InjectAlias]>(() => [context.inject, context.injectAlias], []);
}
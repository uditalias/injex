import * as React from "react";
import InjexContext from "../InjexContext";
import { IInjexContext, Inject, InjectAlias } from "../interfaces";

export function useInjex(): [Inject, InjectAlias] {
    const context = React.useContext<IInjexContext>(InjexContext);

    return React.useMemo<[Inject, InjectAlias]>(() => [context.inject, context.injectAlias], []);
}
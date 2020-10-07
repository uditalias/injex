import * as React from "react";
import { IInjexContext } from "./interfaces";

export default React.createContext<IInjexContext>({
    container: null,
    inject: null,
    injectAlias: null
});
import * as React from "react";
import InjexContext from "./InjexContext";

export default function InjexProvider({ container, children }): JSX.Element {
    const inject = container.get.bind(container);
    const injectAlias = container.getAlias.bind(container);
    const contextValue = React.useMemo(() => ({
        container,
        inject,
        injectAlias
    }), []);

    return (
        <InjexContext.Provider value={contextValue}>
            {children}
        </InjexContext.Provider>
    );
}
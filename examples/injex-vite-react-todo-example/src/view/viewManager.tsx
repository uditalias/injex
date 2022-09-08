import { define, init, inject, singleton } from "@injex/core";
import { InjexProvider } from "@injex/react-plugin";
import InjexVite from "@injex/vite/lib/injex";
import { createRoot, Root } from "react-dom/client";
import App from "../App";

@define("viewManager")
@singleton()
export class ViewManager {
    @inject() private $injex: InjexVite;

    private _root: Root;

    @init()
    protected initialize() {
        this._root = createRoot(
            document.querySelector('.todoapp') as HTMLElement
        );
    }

    public render() {
        this._root.render(
            <InjexProvider container={this.$injex}>
                <App />
            </InjexProvider>
        );
    }
}
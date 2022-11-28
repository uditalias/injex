import { IDefinitionMetadata, IDependency, IInjexPlugin, IModule, Injex, ModuleName } from "@injex/core";
import createConfig from "./createConfig";
import { IGraphPluginConfig } from "./interfaces";
import * as io from "socket.io-client";

type Node = { id: string; text: string; };
type Edge = { id: string; from: string; to: string };

export class GraphPlugin implements IInjexPlugin {

    private config: IGraphPluginConfig;

    private _container: Injex<any>;
    private _nodes: Map<ModuleName, Node>;
    private _edges: Map<string, Edge>;
    private _socket: io.Socket;

    constructor(config: IGraphPluginConfig) {
        this.config = createConfig(config);
        this._nodes = new Map();
        this._edges = new Map();
    }

    public apply(container: Injex<any>) {
        if (!this.config.enabled) {
            return;
        }

        this._container = container;

        this._container.getCurrentModules().forEach((module) => this._onModuleCreated(module));

        container.hooks.afterModuleCreation.tap(this._onModuleCreated, null, this);
        container.hooks.addObject.tap(this._onObjectAdded, null, this);
        container.hooks.bootstrapComplete.tap(this._onBootstrapComplete, null, this);
    }

    private _onModuleCreated({ metadata }: IModule) {
        if(!this._nodes.has(metadata.name)) {
            this._appendModule(metadata);
        }
    }

    private _onObjectAdded({ metadata }: IModule) {
        if(!this._nodes.has(metadata.name)) {
            this._appendModule(metadata, true);
        }
    }

    private _appendModule(metadata: IDefinitionMetadata, plain?: boolean) {
        this._nodes.set(metadata.name, {
            id: String(metadata.name),
            text: String(metadata.name)
        });

        if(plain) {
            return;
        }

        metadata.dependencies?.forEach((dependency: IDependency) => {
            const dModule = this._container.getModuleDefinition(dependency.value);
            if(!dModule?.metadata) {
                return;
            }

            const edgeName = `${String(metadata.name)}_${String(dModule.metadata.name)}`;
            if(!this._edges.has(edgeName)) {
                this._edges.set(edgeName, {
                    id: edgeName,
                    from: String(metadata.name),
                    to: String(dModule.metadata.name)
                });
            }
        });
    }

    private async _onBootstrapComplete() {

        this._socket = io.connect(`http://localhost:${this.config.port}`);

        const graph = {
            appName: this.config.appName,
            nodes: Array.from(this._nodes.values()),
            edges: Array.from(this._edges.values())
        };

        // console.log(graph);

        this._socket.emit('app-graph', graph);
    }
}
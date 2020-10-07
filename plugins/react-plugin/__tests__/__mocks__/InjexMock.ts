import { Injex } from "@injex/core";

export default class InjexMock extends Injex<any> {
    public static create(config?): InjexMock {
        return new InjexMock(config)
    }

    protected createConfig(config?) {
        return { ...config };
    }

    protected loadContainerFiles(): void {
        this.config.modules.forEach((module) => this.registerModuleExports(module));
    }
}
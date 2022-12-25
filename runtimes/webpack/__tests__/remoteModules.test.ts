//@ts-nocheck
import { define, init, singleton } from "@injex/core";
import { join } from "path";
import { RemoteModulesError } from "../src/errors";
import { Injex } from "../src/index";
import { ManagerA } from "./__mocks__/remote/managers/ManagerA";
import { ManagerB } from "./__mocks__/remote/managers/ManagerB";
import { ServiceA } from "./__mocks__/remote/services/ServiceA";
import { ServiceB } from "./__mocks__/remote/services/ServiceB";
import makeRequireWithContext, { RequireWithContext } from "./__mocks__/requireWithContext";

describe("loadRemoteModules", () => {

    let $require: RequireWithContext;
    beforeEach(() => {
        $require = makeRequireWithContext();
    });

    it('should load modules from remote', async () => {
        const container = Injex.create({
            resolveContext: () => $require.context(join(__dirname, './__mocks__'), true, /\.mdl\.ts$/)
        });

        @define()
        @singleton()
        class ModuleA {
            public id: string;

            @init()
            protected initialize() {
                this.id = "123";
            }
        }

        @define()
        @singleton()
        class ModuleB {
            public id: string;

            @init()
            protected initialize() {
                this.id = "456";
            }
        }

        const modulesIndex = Promise.resolve([
            ModuleA,
            ModuleB
        ]);

        await container.loadRemoteModules(() => modulesIndex);

        await container.bootstrap();

        const [moduleA, moduleB] = container.get('moduleA', 'moduleB');

        expect(moduleA).toBeDefined();
        expect(moduleB).toBeDefined();

        expect(moduleA).toBeInstanceOf(ModuleA);
        expect(moduleB).toBeInstanceOf(ModuleB);

        expect(moduleA.id).toEqual('123');
        expect(moduleB.id).toEqual('456');
    });

    it('should load modules from multiple remotes', async () => {

        const container = Injex.create({
            resolveContext: () => $require.context(join(__dirname, './__mocks__/remote'), true, /\.mdl\.ts$/)
        });

        await container.loadRemoteModules(
            () => import(join(__dirname, './__mocks__/remote/managers/index')).then((res) => res.default),
            () => import(join(__dirname, './__mocks__/remote/services/index')).then((res) => res.default)
        );

        await container.bootstrap();

        const [managerA, managerB, serviceA, serviceB] = container.get('managerA', 'managerB', 'serviceA', 'serviceB');

        expect(managerA).toBeDefined();
        expect(managerB).toBeDefined();
        expect(serviceA).toBeDefined();
        expect(serviceB).toBeDefined();

        expect(managerA).toBeInstanceOf(ManagerA);
        expect(managerB).toBeInstanceOf(ManagerB);
        expect(serviceA).toBeInstanceOf(ServiceA);
        expect(serviceB).toBeInstanceOf(ServiceB);
    });

    it('should throw error on bad remote modules', async () => {

        const container = Injex.create({
            resolveContext: () => $require.context(join(__dirname, './__mocks__'), true, /\.ts$/)
        });

        const badLoader = () => import(join(__dirname, './__mocks__/remote/managers/index_not_exists')).then((res) => res.default);

        expect(container.loadRemoteModules(badLoader)).rejects.toThrowError('Failed to load remote modules');
    });
});
import { controller } from "../src/decorators/controller";
import { get } from "../src/decorators/get";
import { post } from "../src/decorators/post";
import { patch } from "../src/decorators/patch";
import { put } from "../src/decorators/put";
import { del } from "../src/decorators/del";
import { define } from "@injex/core";
import metadataHandler from "../src/metadataHandlers";

describe("Decorators", () => {

    it("should create @controller metadata", () => {

        @define()
        @controller()
        class HomeController { }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata).toBeDefined();
    });

    it("should set controller GET route handler", () => {

        @define()
        @controller()
        class HomeController {

            @get("/")
            public getHandler(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(1);
        expect(metadata.routes[0].handler).toBe("getHandler");
        expect(metadata.routes[0].path).toBe("/");
        expect(metadata.routes[0].method).toBe("get");
    });

    it("should set controller POST route handler", () => {

        @define()
        @controller()
        class HomeController {

            @post("/create")
            public postHandler(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(1);
        expect(metadata.routes[0].handler).toBe("postHandler");
        expect(metadata.routes[0].path).toBe("/create");
        expect(metadata.routes[0].method).toBe("post");
    });

    it("should set controller DELETE route handler", () => {

        @define()
        @controller()
        class HomeController {

            @del("/delete")
            public deleteHandler(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(1);
        expect(metadata.routes[0].handler).toBe("deleteHandler");
        expect(metadata.routes[0].path).toBe("/delete");
        expect(metadata.routes[0].method).toBe("delete");
    });

    it("should set controller PATCH route handler", () => {

        @define()
        @controller()
        class HomeController {

            @patch("/patch")
            public patchHandler(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(1);
        expect(metadata.routes[0].handler).toBe("patchHandler");
        expect(metadata.routes[0].path).toBe("/patch");
        expect(metadata.routes[0].method).toBe("patch");
    });

    it("should set controller PUT route handler", () => {

        @define()
        @controller()
        class HomeController {

            @put("/put")
            public putHandler(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(1);
        expect(metadata.routes[0].handler).toBe("putHandler");
        expect(metadata.routes[0].path).toBe("/put");
        expect(metadata.routes[0].method).toBe("put");
    });

    it("should set more than one route", () => {
        @define()
        @controller()
        class HomeController {

            @get("/")
            public render(req, res) {

            }

            @post("/create")
            public create(req, res) {

            }
        }

        const metadata = metadataHandler.getMetadata(HomeController);

        expect(metadata.routes).toBeDefined();
        expect(metadata.routes).toHaveLength(2);

        expect(metadata.routes[0].handler).toBe("render");
        expect(metadata.routes[1].handler).toBe("create");

        expect(metadata.routes[0].path).toBe("/");
        expect(metadata.routes[1].path).toBe("/create");

        expect(metadata.routes[0].method).toBe("get");
        expect(metadata.routes[1].method).toBe("post");
    })
});
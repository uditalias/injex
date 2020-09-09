import { Logger, LogLevel } from "../src/logger";

describe("Logger", () => {

    let logger: Logger;

    beforeEach(() => {
        logger = new Logger(LogLevel.Debug, "");
    });

    it("should skip console method invokation when log level is low", () => {

        const spy = spyOn(console, "info");

        logger.setLogLevel(LogLevel.Error);
        logger.info("info message!");

        expect(spy).toBeCalledTimes(0);
    });

    it("should call console method when log level is ok", () => {
        const spy = spyOn(console, "info");

        logger.setLogLevel(LogLevel.Info);
        logger.info("info message!");

        expect(spy).toBeCalledTimes(1);
    });

    it("should include all log methods", () => {

        expect(logger).toBeInstanceOf(Logger);

        expect(logger).toHaveProperty("info");
        expect(logger).toHaveProperty("error");
        expect(logger).toHaveProperty("warn");
        expect(logger).toHaveProperty("debug");

    });

    it("should print error message", () => {

        const method = spyOn(console, "error");

        logger.error("test message");
        logger.error("another test message");

        expect(method).toBeCalled();
        expect(method).toBeCalledTimes(2);
    });

    it("should print warning message", () => {

        const method = spyOn(console, "warn");

        logger.warn("test message");
        logger.warn("another test message");

        expect(method).toBeCalled();
        expect(method).toBeCalledTimes(2);
    });

    it("should print info message", () => {

        const method = spyOn(console, "info");

        logger.info("test message");
        logger.info("another test message");

        expect(method).toBeCalled();
        expect(method).toBeCalledTimes(2);
    });

    it("should print debug message", () => {

        const method = spyOn(console, "debug");

        logger.debug("test message");
        logger.debug("another test message");

        expect(method).toBeCalled();
        expect(method).toBeCalledTimes(2);
    });

    it("should set the logger namespace", () => {

        let infoArgs;

        console.info = jest.fn((...args) => {
            infoArgs = args;
        });

        const namespace = "MyContainer";
        const message = "Hello World!";

        logger.setNamespace(namespace);

        logger.info(message);

        expect(infoArgs.join(" ")).toContain(`${namespace}: ${message}`);
    });
});
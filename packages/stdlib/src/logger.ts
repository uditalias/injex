export enum LogLevel {
	Error,
	Warn,
	Info,
	Debug,
}

/**
 * Decorates a logger method, once it get's called,
 * check if it allowed and invoke it.
 *
 * @param level - The highest log level to allow
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
 */
function filterLogLevel(level: LogLevel) {
	return function (originalMethod: any, context: ClassMethodDecoratorContext) {
		return function (this: Logger, ...args: any[]) {
			if (this.logLevel >= level) {
				return originalMethod.apply(this, args);
			}
		};
	}
}

type LogMethod = "info" | "warn" | "error" | "debug";

export class Logger {

	constructor(protected logLevel: LogLevel, private namespace: string) { }

	public setLogLevel(logLevel: LogLevel): Logger {
		this.logLevel = logLevel;
		return this;
	}

	public setNamespace(namespace: string): Logger {
		this.namespace = namespace;
		return this;
	}

	@filterLogLevel(LogLevel.Info)
	public info(...args) {
		this.invokeLogMethod("info", args);
	}

	@filterLogLevel(LogLevel.Debug)
	public debug(...args) {
		this.invokeLogMethod("debug", args);
	}

	@filterLogLevel(LogLevel.Warn)
	public warn(...args) {
		this.invokeLogMethod("warn", args);
	}

	@filterLogLevel(LogLevel.Error)
	public error(...args) {
		this.invokeLogMethod("error", args);
	}

	private invokeLogMethod(method: LogMethod, args: any[]) {
		args = [
			`${(new Date()).toLocaleTimeString()} [${method.toUpperCase()}] ${this.namespace}:`,
			...Array.from(args)
		];

		console[method](...args);
	}
}
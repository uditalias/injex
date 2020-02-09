import { Colors } from "./colors";

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
 */
function filterLogLevel(level: LogLevel) {
	return function (target, name, propertyDescriptor) {
		const originalFn = propertyDescriptor.value;

		propertyDescriptor.value = function () {
			if (this.logLevel >= level) {
				originalFn.apply(this, arguments);
			}
		}
	}
}

type LogMethod = "info" | "warn" | "error" | "debug";

export class Logger {

	constructor(private logLevel: LogLevel, private namespace: string) { }

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
		this.invokeLogMethod("info", args, Colors.FgCyan);
	}

	@filterLogLevel(LogLevel.Debug)
	public debug(...args) {
		this.invokeLogMethod("debug", args, Colors.FgGreen);
	}

	@filterLogLevel(LogLevel.Warn)
	public warn(...args) {
		this.invokeLogMethod("warn", args, Colors.FgYellow);
	}

	@filterLogLevel(LogLevel.Error)
	public error(...args) {
		this.invokeLogMethod("error", args, Colors.FgRed);
	}

	private invokeLogMethod(method: LogMethod, args: any[], color: string) {
		args = [
			`${Colors.Dim}${(new Date()).toLocaleTimeString()}${Colors.Reset} ${color}[${method.toUpperCase()}]${Colors.Reset} ${this.namespace}:`,
			...Array.from(args)
		];

		console[method](...args);
	}
}
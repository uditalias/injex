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
function logLevel(level: LogLevel) {
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

	@logLevel(LogLevel.Info)
	public info(...args) {
		this.invokeLogMethos("info", args, Colors.FgCyan);
	}

	@logLevel(LogLevel.Debug)
	public debug(...args) {
		this.invokeLogMethos("debug", args, Colors.FgGreen);
	}

	@logLevel(LogLevel.Warn)
	public warn(...args) {
		this.invokeLogMethos("warn", args, Colors.FgYellow);
	}

	@logLevel(LogLevel.Error)
	public error(...args) {
		this.invokeLogMethos("error", args, Colors.FgRed);
	}

	private invokeLogMethos(method: LogMethod, args: any[], color: string) {
		args = [
			`\x1b[2m${(new Date).toLocaleTimeString()}\x1b[0m ${color}[${method.toUpperCase()}]\x1b[0m ${this.namespace}:`,
			...Array.from(args)
		];

		console[method](...args);
	}
}
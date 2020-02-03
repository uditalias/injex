export declare enum LogLevel {
    Error = 0,
    Warn = 1,
    Info = 2,
    Debug = 3
}
export declare class Logger {
    private logLevel;
    private namespace;
    constructor(logLevel: LogLevel, namespace: string);
    setLogLevel(logLevel: LogLevel): Logger;
    setNamespace(namespace: string): Logger;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    private invokeLogMethos;
}

export interface IEnvPluginConfig<T = any> {
    name?: string;
    current?: string;
    defaults?: Partial<T>;
    environments?: {
        [index: string]: T;
    };
}
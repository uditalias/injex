export interface IEnvPluginConfig {
    name?: string;
    current?: string;
    defaults?: any;
    environments?: {
        [index: string]: any;
    };
}
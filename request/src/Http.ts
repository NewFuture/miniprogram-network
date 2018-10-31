import { BaseConfiguration, Configuration } from "./Configuration";
import { ListenerEvents } from "./Liseteners";

export class Http {

    /**
     * 默认全局配置
     */
    public static defaults: BaseConfiguration = {
        /**
        * 重试一次
        */
        retry: 1,
    };

    /**
     * 全局Listeners
     */
    public static listeners: ListenerEvents = new ListenerEvents;

    public static create(config?: BaseConfiguration): Http {
        return new Http();
    }

    public static request<T>(method: string, action: string, data?: any, config?: BaseConfiguration): Promise<T>;
    public static request<T>(config: Configuration): Promise<T>;
    public static request<T>(config): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static get<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static post<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static put<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static delete<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static head<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }

    public static options<T>(action: string, data?: any, config?: BaseConfiguration): Promise<T> {
        return new Promise<T>(() => { });
    }
};
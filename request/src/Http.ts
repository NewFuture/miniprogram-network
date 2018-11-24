import { WxQueue } from 'miniprogram-queue';
import { promisify } from 'miniprogram-promise';
import { initConfiguration, FullConfiguration, RequestData, TransformConfiguration, WxParam } from "./Configuration";
import { ListenerEvents } from "./Liseteners";
const RequestQueue = new WxQueue(wx.request);
const WxRequest = promisify(RequestQueue.push);

export class Http {

    /**
     * 默认全局配置
     */
    public defaults: initConfiguration = {
        /**
        * 重试一次
        */
        retry: 1,
    };

    /**
     * 全局Listeners
     */
    public listeners: ListenerEvents = new ListenerEvents;

    /**
     * 
     * @param config 
     */
    public constructor(config?: initConfiguration) {
        if (config) {
            this.defaults = config;
        }
    }

    public create(config?: initConfiguration): Http {
        return new Http(config);
    }

    public request<T>(method: string, action: string, data?: any, config?: initConfiguration): Promise<T>;
    public request<T>(config: FullConfiguration): Promise<T>;
    public request<T>(): Promise<T> {
        return new Promise<T>(() => { });
    }

    public get<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('GET', action, data, config);
    }

    public post<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('POST', action, data, config);
    }

    public put<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('PUT', action, data, config);
    }

    public delete<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('DELETE', action, data, config);
    }

    public head<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('HEAD', action, data, config);
    }

    public options<T>(action: string, data?: any, config?: initConfiguration): Promise<T> {
        return this.request<T>('OPTIONS', action, data, config);
    }

    private send<T>(requestData: RequestData, transform: TransformConfiguration) {
        const wxdata = transform.transformRequest(requestData.data);
        return Promise
        .resolve(wxdata)
        .then((param)=>{
            param.success=()
        })
        .then(transform.transformResponse)
    }

};
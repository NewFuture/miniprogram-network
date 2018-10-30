import {Configuration} from "./Configuration";


export class Http {

    public request<T>(method: string, action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public get<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public post<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public put<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public delete<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public head<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }

    public options<T>(action: string, data?: any, config?: Configuration):Promise<T>
    {
        return new Promise<T>(()=>{});
    }
};
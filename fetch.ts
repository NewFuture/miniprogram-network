import {WxQueue} from './WxQueue';

//@ts-ignore
const RequestMQ = new WxQueue(wx.request);

/**
 * fetch 封装
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
 * @param url 请求URL或者Request对象
 * @param init 请求参数
 */
export function fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {

    init = init || {}

    const param: any = ((typeof url) !== 'object') ?
        {
            url,
            data: init.body,
            header: init.headers || {},
            method: init.method,
            dataType: 'text'
        } : {
            url: (url as Request).url,
            data: (url as Request).json() || (url as Request).text() || (url as Request).body,
            method: init.method || (url as Request).method,
            header: Object.assign({}, (url as Request).headers, init.headers),
            dataType: 'text',

        };

    return new Promise<Response>((resolve, reject) => {
        param.success = function (res: any) {
            var response = new wxHttpResponse(res);
            resolve(response);
        };
        param.fail = reject;
        param.complete = init['complete'];
        RequestMQ.push(param);
    })
}


class wxHttpResponse implements Response {
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    trailer: Promise<Headers>;
    type: ResponseType;
    url: string;
    body: ReadableStream | any;
    bodyUsed: boolean;
    constructor(res: { data: any, statusCode: number, header: Headers }) {
        this.status = res.statusCode;
        this.headers = res.header;
        this.body = res.data;
        this.ok = res.statusCode >= 200 && res.statusCode < 300;
        this.bodyUsed = false
    }
    /**
     * Copy
     */
    clone(): Response {
        return Object.assign(this);
    }
    arrayBuffer(): Promise<ArrayBuffer> {
        throw new Error("Method not implemented.");
    }
    blob(): Promise<Blob> {
        throw new Error("Method not implemented.");
    }
    formData(): Promise<FormData> {
        throw new Error("Method not implemented.");
    }
    /**
     * to json as promise
     */
    json(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(JSON.parse(this.body));
                this.bodyUsed = true;
            } catch (error) {
                reject(error);
            }
        })
    }
    /**
     * to string as promise
     */
    text(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.body);
                this.bodyUsed = true;
            } catch (error) {
                reject(error);
            }
        })
    }
}
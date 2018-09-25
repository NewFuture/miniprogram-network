/**
 * Request 请求队列管理
 */
const RequestMQ = {
    map: {},
    mq: [],
    running: [],
    MAX_REQUEST: 10,
    push(param) {
        param.t = new Date().getTime();
        while ((this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1)) {
            param.t += Math.random() * 10 >> 0;
        }
        this.mq.push(param.t);
        this.map[param.t] = param;
    },
    next() {
        let me = this;

        if (this.mq.length === 0)
            return;

        if (this.running.length < this.MAX_REQUEST - 1) {
            let newone = this.mq.shift();
            let obj = this.map[newone];
            let oldComplete = obj.complete;
            obj.complete = (...args) => {
                me.running.splice(me.running.indexOf(obj.t), 1);
                delete me.map[obj.t];
                oldComplete && oldComplete.apply(obj, args);
                me.next();
            }
            this.running.push(obj.t);
            //@ts-ignore
            return wx.request(obj);
        }
    },
    request(obj) {
        obj = obj || {};
        obj = (typeof (obj) === 'string') ? { url: obj } : obj;
        this.push(obj);
        return this.next();
    }
};

class wxHttpResponse implements Response {
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    trailer: Promise<Headers>;
    type: ResponseType;
    url: string;
    data: any;
    constructor(res: {data:any,statusCode:number,header:Headers}) {
        this.status = res.statusCode;
        this.headers = res.header;
        this.data = res.data;
        this.ok = res.statusCode >= 200 && res.statusCode < 300;
    }
    clone(): Response {
        throw new Error("Method not implemented.");
    }
    body: ReadableStream;
    bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer> {
        throw new Error("Method not implemented.");
    }
    blob(): Promise<Blob> {
        throw new Error("Method not implemented.");
    }
    formData(): Promise<FormData> {
        throw new Error("Method not implemented.");
    }
    json(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(JSON.stringify(this.data));
            } catch (error) {
                reject(error);
            }
        })
    }
    text(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.data);
            } catch (error) {
                reject(error);
            }
        })
    }
}


/**
 * fetch 封装
 */
export function fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    var param = {
          url,
          data: init.body,
          header: init.headers || {},
          method: init.method,
          dataType: 'text',
          success: function (res: any) {
            var response = new wxHttpResponse(res);
            resolve(response);
          },
          fail: reject
          complete: init.complete
        }
      RequestMQ.request(param)
    })
}

import { Http } from './src/http';
import { WxParam } from './src/transform';

import { RequestData, RequestOptions, Configuration } from './src/configuration'

// 全局
const Request = new Http();

export {
    Request,
    Http,
    Configuration,
    RequestOptions,
    RequestData,
    WxParam,
}
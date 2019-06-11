import {
    REQUEST, transformRequestResponseOkData,
    DOWNLOAD, transformDownloadResponseOkData,
    UPLOAD, transformUploadResponseOkData, setConfig, delayRetry,
} from '../src/index'

// Request的默认响应拦设为成transformRequestResponseOkData,正常返回data部分
REQUEST.Defaults.transformResponse = transformRequestResponseOkData;
// Download的默认响应拦设为transformDownloadResponseOkData，正常返回string
DOWNLOAD.Defaults.transformResponse = transformDownloadResponseOkData;
// Upload默认响应拦截transformUploadResponseOkData设置正常返回data
UPLOAD.Defaults.transformResponse = transformUploadResponseOkData;

DOWNLOAD.download('url')
    .then(path=>{
        console.log(path);//string
    }).catch(res=>{
        console.error(res);//objct
    });

setConfig({
    baseURL:'',
});
setConfig('baseURL','https://api.xyz');
const retry = delayRetry<object>(100,10);
setConfig('retry', retry )

REQUEST.Defaults.retry=delayRetry(1000,2);
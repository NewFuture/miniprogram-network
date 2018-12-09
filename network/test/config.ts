import {
    Request, transformRequestResponseOkData,
    Download, transformDownloadResponseOkData,
    Upload, transformUploadResponseOkData, setConfig,
} from '../index'

// Request的默认响应拦设为成transformRequestResponseOkData,正常返回data部分
Request.Defaults.transformResponse = transformRequestResponseOkData;
// Download的默认响应拦设为transformDownloadResponseOkData，正常返回string
Download.Defaults.transformResponse = transformDownloadResponseOkData;
// Upload默认响应拦截transformUploadResponseOkData设置正常返回data
Upload.Defaults.transformResponse = transformUploadResponseOkData;

Download.download('url')
    .then(path=>{
        console.log(path);//string
    }).catch(res=>{
        console.error(res);//objct
    });

setConfig({
    baseURL:'',
});
setConfig('baseURL','https://api.xyz');

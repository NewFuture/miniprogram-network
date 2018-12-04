// import { Request, Http } from "miniprogram-request";
// import { Upload, Uploader } from "miniprogram-uploader";
// import { Download, Downloder } from "miniprogram-downloader";
// export const Netwrok: Readonly<{
//     Http: Http,
//     Uploader: Uploader,
//     Downloder: Downloder,
// }> = {
//     Http: Request,
//     Uploader: Upload,
//     Downloder: Download,
// }

export {
    Http,
    Request,
    RequestOption,
    RequestConfig,
    RequestInit,
    RequestParams,
    transformRequestResponseOkData,
    transformRequestSendDefault,
    CancelToken,
} from "miniprogram-request";

export {
    Uploader,
    Upload,
    UploadOption,
    UploadInit,
    UploadParams,
    transformUploadResponseOkData,
    transformUploadSendDefault,
} from 'miniprogram-uploader';

export {
    Downloder,
    Download,
    DownloadOption,
    DownloadInit,
    DownloadParams,
    transformDownloadResponseOkData,
    transfomDownloadSendDefault,
} from 'miniprogram-downloader'


import { BaseConfiguration, ExtraConfiguration, LifeCircle } from 'miniprogram-network-utils';
import { defaultUploadTransformSend, defaultUploadTransformResponse } from './transform';

export type UploadInit = BaseConfiguration<UploadOptions, wx.UploadFileOption>;
export interface UploadOptions extends UploadInit, ExtraConfiguration<wx.UploadTask> {
    url: string,
    filePath: string,
    name: string,
    data: wx.UploadFileOption['formData'],
}

export class Uploader extends LifeCircle<wx.UploadFileOption, wx.UploadTask, UploadInit, UploadOptions>
{
    /**
 * 默认数据转换函数
 */
    public readonly TransformSend: UploadOptions['transformSend'] = defaultUploadTransformSend;

    /**
     * 默认输出数据转换函数
     */
    public readonly TransformResponse: UploadOptions['transformResponse'] = defaultUploadTransformResponse;

    constructor(config?: UploadInit, op?: (op: wx.UploadFileOption) => wx.UploadTask) {
        super(config || { retry: 1 }, op || wx.uploadFile);
    }

    public upload(options: UploadOptions) {
        this.process(options);
    }
}
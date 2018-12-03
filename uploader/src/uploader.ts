
import { BaseConfiguration, ExtraConfiguration, LifeCircle } from 'miniprogram-network-life-circle';
import { WxQueue } from 'miniprogram-queue';
import { defaultUploadTransformSend, defaultUploadTransformResponse } from './transform';

const upload = new WxQueue<wx.UploadFileOption, wx.UploadTask>(wx.uploadFile);

export type UploadInit = BaseConfiguration<UploadOptions, wx.UploadFileOption>;
export interface UploadOptions extends UploadInit, ExtraConfiguration<wx.UploadTask> {
    url: string,
    filePath: string,
    name: string,
    data?: wx.UploadFileOption['formData'],
}

/**
 * 上传管理
 */
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

    /**
     * 创建Upload管理
     * @param config 全局配置
     * @param op 操作函数
     */
    constructor(config?: UploadInit, op?: (op: wx.UploadFileOption) => wx.UploadTask) {
        super(config || { retry: 1 }, op || upload.push);
    }

    public upload<T>(filePath: string, name: string, url: string, options?: Exclude<UploadOptions, 'url' | 'filePath' | 'formData'>): Promise<T>;
    public upload<T>(options: UploadOptions): Promise<T>;
    public upload<T>(): Promise<T> {
        const arg_num = arguments.length;
        const options: UploadOptions = arg_num == 1 ? arguments[0] : (arg_num === 4 ? arguments[3] : {});
        if (arg_num > 1) {
            options.filePath = arguments[0];
            options.name = arguments[1];
            options.url = arguments[2];
        }
        return this.process<T>(options);
    }
}
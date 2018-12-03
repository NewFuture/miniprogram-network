
import { BaseConfiguration, ExtraConfiguration, LifeCircle } from 'miniprogram-network-life-circle';
import { WxQueue } from 'miniprogram-queue';
import { defaultUploadTransformSend, defaultUploadTransformResponse } from './transform';

const uploadQueue = new WxQueue<wx.UploadFileOption, wx.UploadTask>(wx.uploadFile);
/**
 * 默认配置信息
 */
export type UploadInit = BaseConfiguration<UploadOptions, wx.UploadFileOption>;
/**
 * 全部配置信息
 */
export interface UploadOptions extends UploadInit, ExtraConfiguration<wx.UploadTask> {
    url: string,
    filePath: NonNullable<string>,
    name: NonNullable<string>,
    data?: wx.UploadFileOption['formData'],
    onProgress?: wx.UploadTask['offProgressUpdate']
}

/**
 * 上传管理
 */
export class Uploader extends LifeCircle<wx.UploadFileOption, wx.UploadTask, UploadInit, UploadOptions>
{
    /**
     * 默认上传请求参数转换函数
     */
    public readonly TransformSend = defaultUploadTransformSend;

    /**
     * 默认上传返回数据转换函数
     */
    public readonly TransformResponse = defaultUploadTransformResponse;

    /**
     * 创建Upload管理
     * @param config 全局配置
     * @param op 操作函数,默认队列管理
     */
    constructor(config?: UploadInit, op?: (op: wx.UploadFileOption) => wx.UploadTask) {
        super(op || uploadQueue.push, config);
    }

    /**
     * 快速上传文件
     * @param url 上传地址 
     * @param filePath 本地文件路径
     * @param name 文件名
     * @param data 附加formData数据，可选
     * @param options 其他参数
     */
    public upload<T>(url: string, filePath: string, name: string, data?: any, options?: Exclude<UploadOptions, 'url' | 'filePath' | 'formData' | 'data'>): Promise<T>;
    /**
     * 自定义上传
     * @param options 全部配置信息:url,filePath,name,为必填字段
     */
    public upload<T>(options: UploadOptions): Promise<T>;
    public upload<T>(): Promise<T> {
        const arg_num: number = arguments.length;
        const options: UploadOptions = arg_num == 1 ? arguments[0] : (arguments[4] || {});
        if (arg_num > 1) {
            options.url = arguments[0];
            options.filePath = arguments[1];
            options.name = arguments[2];
            options.data = arguments[3];
        }
        return this.process<T>(options);
    }
};
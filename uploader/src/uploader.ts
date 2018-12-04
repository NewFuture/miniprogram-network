
import { BaseConfiguration, ExtraConfiguration, LifeCircle } from 'miniprogram-network-life-circle';
import { WxQueue } from 'miniprogram-queue';
import { uploadTransformSendDefault, uploadTransformResponseDefault } from './transform';

const uploadQueue = new WxQueue<wx.UploadFileOption, wx.UploadTask>(wx.uploadFile);
/**
 * 默认配置信息
 */
export interface UploadInit extends BaseConfiguration<UploadOption, wx.UploadFileOption> {
    url?: string,
};
/**
 * 全部配置信息
 */
export interface UploadOption extends UploadInit, ExtraConfiguration<wx.UploadTask> {
    filePath: NonNullable<string>,
    name: NonNullable<string>,
    data?: wx.UploadFileOption['formData'],
    onProgress?: wx.UploadTask['offProgressUpdate']
}

/**
 * 上传管理
 */
export class Uploader extends LifeCircle<wx.UploadFileOption, wx.UploadTask, UploadInit, UploadOption>
{
    /**
     * 默认上传请求参数转换函数
     */
    public readonly TransformSend = uploadTransformSendDefault;

    /**
     * 默认上传返回数据转换函数
     */
    public readonly TransformResponse = uploadTransformResponseDefault;

    /**
     * 创建Upload管理
     * @param config 全局配置
     * @param uploader 操作函数,默认使用上传队列
     */
    constructor(config?: UploadInit, uploader?: (op: wx.UploadFileOption) => wx.UploadTask) {
        super(uploader || uploadQueue.push, config);
    }

    /**
     * 快速上传文件
     * @param filePath 本地文件路径
     * @param name 文件名
     * @param url 上传地址可选
     * @param data 附加formData数据，可选
     * @param options 其他参数
     */
    public upload<T=ReturnType<Uploader['TransformResponse']>>(
        filePath: string,
        name: string,
        url?: string,
        data?: any,
        config?: Exclude<UploadOption, 'filePath' | 'formData' | 'data'>): Promise<T>;
    /**
     * 自定义上传
     * @param options 全部配置信息:filePath,name,为必填字段
     */
    public upload<T=ReturnType<Uploader['TransformResponse']>>(options: UploadOption): Promise<T>;
    public upload<T=ReturnType<Uploader['TransformResponse']>>(): Promise<T> {
        const arg_num: number = arguments.length;
        const options: UploadOption = arg_num == 1 ? arguments[0] : (arguments[4] || {});
        if (arg_num > 1) {
            options.filePath = arguments[0];
            options.name = arguments[1];
            options.url = arguments[2];
            options.data = arguments[3];
        }
        return this.process<T>(options);
    }
};
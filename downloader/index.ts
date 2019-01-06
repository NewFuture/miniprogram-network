/// <reference path="./src/wx.download.d.ts"/>
import { Downloader } from './src/downloader';
export { CancelToken } from 'miniprogram-network-life-cycle';
export { Downloader, DownloadOption, DownloadInit } from "./src/downloader";
export { transfomDownloadSendDefault, transformDownloadResponseOkData, DownloadParams } from "./src/transform";
/**
 * 于定义全局Download
 */
export const Download = new Downloader();

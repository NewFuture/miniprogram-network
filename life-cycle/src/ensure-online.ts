import { CancelToken } from 'miniprogram-cancel-token';
// tslint:disable: no-use-before-declare

/**
 * 网络是否联接
 */
let isConnected: boolean = false;
/**
 * 是否隐藏在后台
 */
let isHidden: boolean = false;

const callbackPools: (() => void)[] = [];

function checkCallbacks() {
    if (isConnected && !isHidden) {
        while (callbackPools.length > 0) {
            callbackPools.shift()!();
        }
    }
}
wx.onAppHide(() => { isHidden = true; });
wx.onAppShow(() => {
    isHidden = false;
    checkCallbacks();
});
wx.onNetworkStatusChange((res) => {
    isConnected = res.isConnected;
    checkCallbacks();
});
wx.getNetworkType({
    success(res) {
        isConnected = res.networkType !== 'none';
        checkCallbacks();
    }
});

/**
 * 确保在线时执行
 * 网络掉线或者切换到后台的情况暂停发送
 * @param callback 回调
 * @param cancelToken 取消操作
 */
export function ensureOnline(callback: () => void, cancelToken?: CancelToken): void {
    if (isConnected && !isHidden) {
        callback();
    } else {
        callbackPools.push(callback);
        if (cancelToken) {
            // tslint:disable-next-line: no-floating-promises
            cancelToken.promise.then(() => {
                const index = callbackPools.indexOf(callback);
                if (index !== -1) {
                    callbackPools.splice(index, 1);
                }
            });
        }
    }
}

declare namespace wx {
    interface OnNetworkStatusChangeCallbackResult {
        /** 当前是否有网络连接 */
        isConnected: boolean;
        /** 网络类型
         *
         * 可选值：
         * - 'wifi': wifi 网络;
         * - '2g': 2g 网络;
         * - '3g': 3g 网络;
         * - '4g': 4g 网络;
         * - 'unknown': Android 下不常见的网络类型;
         * - 'none': 无网络;
         */
        networkType: 'wifi' | '2g' | '3g' | '4g' | 'unknown' | 'none';
    }

    function getNetworkType(option?: { success?(result: OnNetworkStatusChangeCallbackResult): void }): void;
    /** 网络状态变化事件的回调函数 */
    function onNetworkStatusChange(callback: (result: OnNetworkStatusChangeCallbackResult) => void): void;
    /** 小程序切后台事件的回调函数 */
    function onAppHide(callback: () => void): void;
    /** 小程序切前台事件的回调函数 */
    function onAppShow(callback: () => void): void;
}

import { WxQueue } from './src/queue';

declare var wx: {
    request: Function;
    downloadFile: Function;
    uploadFile: Function;
}

function apply() {
    ['request', 'downloadFile', 'uploadFile'].forEach(element => {
        //@ts-ignore
        wx['_' + element] = wx[element];
        //@ts-ignore
        const queue = new WxQueue(wx[element]);
        Object.defineProperty(wx, element, {
            get() {
                return queue.push;
            }
        })
    });
}

export {
    WxQueue,
    apply
};
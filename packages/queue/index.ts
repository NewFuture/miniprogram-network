import { WxQueue } from './queue';

declare var wx: {
    request: Function;
    downloadFile: Function;
    uploadFile: Function;
}

function apply() {
    ['request', 'downloadFile', 'uploadFile'].forEach(element => {
        wx['_' + element] = wx[element];
        let queue = new WxQueue(wx[element]);
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
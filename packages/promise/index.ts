import "./Promise.finally";
import { promisify, promisifyCancel } from "./promisify";

declare var wx: {
    request: Function;
    downloadFile: Function;
    uploadFile: Function;
}

const CANCELABLE_API = ['request', 'downloadFile', 'uploadFile'];
const NOPROMIS_API = ['canIUse', 'drawCanvas'];

function apply() {

    for (let key in wx) {
        let func: Function;

        if (!wx.hasOwnProperty(key)) {
            continue;
        } else if (/^on|^create|^pause|Sync$|Manager$/.test(key) || NOPROMIS_API.indexOf(key) >= 0 && key !== 'createBLEConnection') {
            continue;
        } else if (CANCELABLE_API.indexOf(key) >= 0) {
            func = promisifyCancel(wx[key]);
        } else {
            func = promisify(wx[key]);
        }

        Object.defineProperty(wx, key, {
            get() {
                return func;
            }
        })
    }
}

export {
    apply,
    promisify,
    promisifyCancel
}

import { Network, get, del, upload, download, request } from "../index";

get('test').then((r) => r);

get<string>('s')
del('ss').then(console.log)

upload('ss', 'testname');

download('ss');
download({
    url: 'sss',
    jump: true,
    onHeadersReceived: function (res) {
        console.log(res.header)
    }
} as Network.DownloadOption).then(res=>res.statusCode);

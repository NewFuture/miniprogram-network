
import {Request, get, del, upload, download } from "../index";

get('test').then((r)=>r);

del('ss').then(console.log)

upload('ss','testname');

download('ss');

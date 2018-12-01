import {Request} from '../index';

// 设置全局配置，设置一次全部生效
// 设置请求根地址,可选
Request.Defaults.baseURL = "https://minipgrogram.newfuture.cc/"
// 添加监听时间 可选
Request.Listeners.onResponse.push(console.log); // 记录每次响应

// @ts-ignore
Request.get('items').then(applyFunction).catch(err=>wx.showToast({title:'数据拉取失败'}));

// URL 参数 
Request.get('items/{id}',{show_detail:false},{params:{id:12345}})
// GET /items/12345?show_detail=false

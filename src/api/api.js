import axios from 'axios';
import AppInstance from '@/main'
import CONFIG from '@/config'
import {formatDate} from "element-ui/packages/date-picker/src/util";

let BASE_URL = CONFIG.BASE_URL;
let token = '';

axios.defaults.withCredentials = false;
axios.defaults.headers.common['AUTH_TOKEN'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
axios.defaults.baseURL = BASE_URL;

//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    let data = config.data;
    let pageable = null;
    if (data.pageable){
        pageable = data.pageable;
        delete data.pageable;
    }
    let date = new Date();
    config.data = {
        requestId : formatDate(date,'yyyyMMdd'),
        timestamp : date,
        data: data
    };
    if (pageable != null){
        config.data.pageable = pageable;
    }
    let user = JSON.parse(window.sessionStorage.getItem('AUTH'));
    if (user) {
        token = user.token;
    }
    config.headers.common['AUTH_TOKEN'] = token;
    return config;
}, function (error) {
    // Do something with request error
    console.error("error: "+error);
    return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.data && response.data.code) {
        console.info(response.data)
    }
    return response;
}, function (error) {
    // Do something with response error
    console.error(error);
    AppInstance.$message.error("服务器连接失败");
    return Promise.reject(error);
})

//通用方法
export const POST = (url, params) => {
    return axios.post(`${url}`, params).then(res => res.data)
}

export const GET = (url, params) => {
    return axios.get(`${url}`, {params:params}).then(res => res.data)
}

export const PUT = (url, params) => {
    return axios.put(`${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
    return axios.delete(`${url}`, params).then(res => res.data)
}

export const PATCH = (url, params) => {
    return axios.patch(`${url}`, params).then(res => res.data)
}

export const create = axios.create({
    timeout: 7000, // 请求超时时间
    baseURL: BASE_URL,
    method: 'post',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})
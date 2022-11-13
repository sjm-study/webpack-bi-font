import axios from 'axios'
import { message } from 'antd'
import store  from "../store/store";

const axiosInstance = axios.create({
    baseURL: '/',
    timeout: 5000
});

// 请求前拦截
axiosInstance.interceptors.request.use(
    config=> {
        // console.log(store.getState());
        // 设置请求header
        // config.headers.test = '123';
        return config
    },
    error => {
        message.error(error)
    }
);

// 响应拦截
axiosInstance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code === 0) {
                if (response.data.message) {
                    message.success(response.data.message, 2)
                }
            } else if (response.data.code === 1){
                if (response.data.message) {
                    message.error(response.data.message, 2)
                }
            }
        } else {
        }
        return response.data
    },
    error => {
        // if (error.response.status === 403) {
        //     message.error(error.response.data.message, 2)
        //     return error
        // }
        return error
    }
);

export default axiosInstance

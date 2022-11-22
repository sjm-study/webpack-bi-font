import axios from './index'

// 获取个人信息
export function getUserInfo() {
    return axios({
        url: '/admin/userInfo',
        method: 'get'
    })
}

// 登陆接口
export function Login(data) {
    return axios({
        url: '/admin/login',
        method: 'post',
        data: data
    })
}

// 推出登陆
export function loginout() {
    return axios({
        url: '/admin/loginout',
        method: 'post'
    })
}

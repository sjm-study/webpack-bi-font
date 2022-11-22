import axios from './index'

// 申请租借
export function ApplyAssent(data) {
    return axios({
        url: 'home/user/apply',
        method: 'post',
        data: data
    })
}

// 首页 获取个人所有租借信息
export function getUserAssent(query) {
    return axios({
        url: '/home/user/all',
        method: 'get',
        params: query
    })
}

// 首页 获取个人驳回的租借信息
export function getUserReject(qurey) {
    return axios({
        url: '/home/user/reject',
        method: 'get',
        params: qurey
    })
}

// 用户重新提交审核信息
export function updateAssent(data) {
    return axios({
        url: '/home/user/reject',
        method: 'put',
        data: data
    })
}

// 获取库存
export function getStock() {
    return axios({
        url: 'choice/stock',
        method: 'get'
    })
}

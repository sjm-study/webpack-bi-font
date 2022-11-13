import axios from './index'

// 此刻温湿度
export function nowTemHum(query) {
    return axios({
        url: '/lab/now',
        method: 'get',
        params: query
    })
}
// 验证实验室名称
export function verificate(data) {
    return axios({
        url: '/lab/verification',
        method: 'post',
        data
    })
}

// 查询实验室温湿度
export function searchTH(query) {
    return axios({
        url: '/lab/search_TH',
        method: 'get',
        params: query
    })
}

// 全站展览 代办事项
export function getUntreated() {
    return axios({
        url: '/choice/untreated',
        method: 'get'
    })
}

// 全站展览 温湿度
export function getHot() {
    return axios({
        url: '/lab/hot_TH',
        method: 'get'
    })
}

// 门锁列表
export function getUnlock(query) {
    return axios({
        url: '/admin/unlock',
        method: 'get',
        params: query
    })
}

// 实验室名称
export function getName() {
    return axios({
        url: '/choice/lab_name',
        method: 'get'
    })
}

import axios from './index'


// 获取资产总表
export function AssentTotal(query) {
    return axios({
        url: '/admin/total',
        method: 'get',
        params: query
    })
}

// 删除单条租借信息
export function deleteAssent(_id) {
    return axios({
        url: '/admin/total/' + _id,
        method: 'delete'
    })
}

// 获取资产未审核信息
export function CheckAudit(query) {
    return axios({
        url: '/admin/audit',
        method: 'get',
        params: query
    })
}

// 提交通过审核
export function SubmitAuditSuccess(data) {
    return axios({
        url: '/admin/audit/success',
        method: 'patch',
        data: data
    })
}

// 提交审核不通过
export function SubmitAuditFail(data) {
    return axios({
        url: '/admin/audit/fail',
        method: 'patch',
        data: data
    })
}

// 获取未领取信息
export function CheckReceive(query) {
    return axios({
        url: '/admin/receive',
        method: 'get',
        params: query
    })
}

// 提交领取审核信息
export function ReceiveSuccess(data) {
    return axios({
        url: '/admin/receive/audit',
        method: 'patch',
        data: data
    })
}

// 获取未归还信息
export function CheckReturn(query) {
    return axios({
        url: '/admin/return',
        method: 'get',
        params: query
    })
}

// 提交归还审核
export function ReturnSuccess(data) {
    return axios({
        url: '/admin/return/audit',
        method: 'patch',
        data: data
    })
}


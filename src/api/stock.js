import axios from './index'

// 获取库存
export function getStock(query) {
    return axios({
        url: '/admin/stock',
        method: 'get',
        params: query
    })
}

// 增加库存
export function addStock(data) {
    return axios({
        url: '/admin/stock',
        method: 'post',
        data: data
    })
}

// 编辑库存
export function updateStock(id, data) {
    return axios({
        url: '/admin/stock/' + id ,
        method: 'put',
        data: data
    })
}

// 删除库存
export function deleteStock(id) {
    return axios({
        url: '/admin/stock/' + id ,
        method: 'delete',
        // data: {_id: id}
    })
}

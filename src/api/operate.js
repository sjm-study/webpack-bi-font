import axios from './index'

export function getOperate(query) {
    return axios({
        url: '/admin/operate',
        method: 'get',
        params: query
    })
}

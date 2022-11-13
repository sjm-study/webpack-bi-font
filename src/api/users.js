import axios from './index'

export  function getUser(query) {
    return axios({
        url: '/admin/users',
        method: 'get',
        params: query
    })
}

export function updataUser(_id, data) {
    return axios({
        url: '/admin/users/' + _id,
        method: 'put',
        data: data
    })
}

export function deleteUser(_id) {
    return axios({
        url: '/admin/users/' + _id,
        method: 'delete'
    })
}

export function addUser(data) {
    return axios({
        url: '/admin/users',
        method: 'post',
        data: data
    })
}

export function changePassword(data) {
    return axios({
        url: '/admin/users',
        method: 'patch',
        data: data
    })
}

export function restPassword(id) {
    return axios({
        url: '/admin/users/reset/' + id,
        method: 'patch'
    })
}

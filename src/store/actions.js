import { SET_INFO, DEL_INFO } from './action_type'

export const set_info = (data) => ({type: SET_INFO, data: data});
export const del_info = (data) => ({type: DEL_INFO, data: data});

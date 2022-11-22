import { SET_INFO, DEL_INFO } from './action_type'

export function userInfo(state = {}, action) {
    switch (action.type) {
        case SET_INFO:
            return state = action.data;
        case DEL_INFO:
            return state = {};
        default:
            return state
    }
}


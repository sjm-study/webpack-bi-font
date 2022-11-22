import { createStore } from 'redux'
import { userInfo } from './reducers'

const store = createStore(userInfo);

export default store


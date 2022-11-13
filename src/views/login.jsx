import React from 'react'
import {Route} from 'react-router-dom'
import Register from './register';
import Teacher from './teacher/teacher_apply'
import Main from './main'
import { getUserInfo } from '../api/login'
import { connect } from 'react-redux'
import { set_info } from '../store/actions'
// import 'antd/dist/antd.css'


class Login extends React.Component {


    loadingPage = () => {
        getUserInfo().then(res => {
            if (res.code === 1) {
                this.props.history.push('/register')
            } else if (res.code === 0) {
                this.props.set_info(res.data);
                if (res.data.role === 'admin') {
                    this.props.history.push('/main/index')
                } else if (res.data.role === 'teacher'){
                    this.props.history.push('/teacher_apply')
                }
            }
        })
    };

    componentDidMount() {
        this.loadingPage()
    }

    render() {
        return (
            <div>
                <Route path='/register' component={Register}/>
                <Route path='/main' component={Main}/>
                <Route path='/teacher_apply' component={Teacher}/>
            </div>
        )
    }
}
export default connect(
    state => ({userInfo: state}),
    {set_info: set_info}
)(Login)

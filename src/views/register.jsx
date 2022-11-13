import React from 'react'
import {Input,Button, Icon, Form} from 'antd'
import '../css/register.css'
import {getUserInfo, Login} from '../api/login'
import { connect } from 'react-redux'
import { set_info } from '../store/actions'

class NormalLoginForm extends React.Component {

    state={
        username:'',
        password:''
    };


    handleChange = (name,e) => {
        this.setState({[name]:e.target.value})
    };


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = this.state;
                Login(data).then(res => {
                    if (res.code === 0){
                        this.props.set_info(res.data);
                        if (res.data.role === 'admin') {
                            this.props.history.push('/main/index')
                        }
                        if (res.data.role === 'teacher') {
                            this.props.history.push('/teacher_apply')
                        }
                    }
                })
            }
        });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="body">
                <div className="box" >
                    <span style={{fontSize: 25}}>计算机实验室环境侦查系统</span><br/><br/><br/>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                    size={"large"}
                                    onChange={e => {this.handleChange('username',e)}}
                                    style={{width: 450}}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                    size={"large"}
                                    onChange={e => {this.handleChange('password',e)}}
                                    style={{width: 450}}
                                />,
                            )}<br/>
                            {/*<Button type='link' size="small"*/}
                            {/*        style={{float: 'right', marginRight: '66px', color: '#B3B3B3'}}*/}
                            {/*        onClick={this.resetEvent}*/}
                            {/*>*/}
                            {/*    忘记密码*/}
                            {/*</Button>*/}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit"
                                    onClick={this.handleSubmit} className="login-form-button"
                                    style={{width: 450}}
                                    size={"large"}
                            >
                                登 陆
                            </Button>
                            <br/>
                        </Form.Item>
                </Form>
                </div>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'register' })(NormalLoginForm);
export default connect(
    state => ({userInfo: state}),
    {set_info: set_info}
)(WrappedNormalLoginForm)

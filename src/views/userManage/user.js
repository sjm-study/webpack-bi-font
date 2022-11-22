import React from 'react'
import {Button, Divider, Form, Input, message} from "antd";
import { connect } from 'react-redux'
import { changePassword } from '../../api/users'


class User extends React.Component {

    state = {
        oldPassword: '',
        newPassword: '',
        comfirmPassword: ''
    };
    handleChange =(name,e)=> {
        this.setState({
            [name]: e.target.value
        })
    };

    handleSubmit=()=>{
        if (this.state.newPassword === this.state.comfirmPassword){
            var data ={
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
                name: this.props.userInfo.name
            };
            changePassword(data).then(res => {
                if (res.code === 0) {
                    this.setState({
                        oldPassword: '',
                        newPassword: '',
                        comfirmPassword: ''
                    })
                }
            })
        }else {
            message.error('确认密码与新密码不正确')
        }
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <div>
                    <div style={{fontSize:'26px'}}>修改密码</div>
                    <Divider style={{backgroundColor: 'white'}} />
                </div>
                <Form {...formItemLayout}>
                    <Form.Item label='旧密码：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                        <Input  type={'password'} value={this.state.oldPassword} onChange={(e) => {this.handleChange('oldPassword', e)}} style={{width: 200}}/>
                    </Form.Item>
                    <Form.Item label='新密码：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                        <Input  type={'password'} value={this.state.newPassword} onChange={(e) => {this.handleChange('newPassword', e)}} style={{width: 200}}/>
                    </Form.Item>
                    <Form.Item label='确认密码：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                        <Input type={'password'} value={this.state.comfirmPassword} onChange={(e) => {this.handleChange('comfirmPassword', e)}} style={{width: 200}}/>
                    </Form.Item><br/>
                    <Button type='primary' onClick={this.handleSubmit} style={{marginLeft: '30%'}}>确定</Button>
                </Form>
            </div>
        )
    }
}

export default connect(
    state => ({userInfo: state}),
)(User)

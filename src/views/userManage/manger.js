import React from 'react'
import {Button, Divider, Form, Input, Modal, Popconfirm, Table, Radio} from "antd";
import Pagination from "../../components/pagination";
import { getUser, updataUser, deleteUser, addUser, restPassword } from '../../api/users'


export default class Manger extends React.Component {

    state={
        searchname:'',
        dataSource: [],
        loading: false,
        total: 0,
        addVisible: false,
        name: '',
        sex: '',
        telephone: '',
        role: '',
        editVisible: false,
        editName: '',
        editSex: '',
        editRole: '',
        editTelephone: '',
        editId: ''
    };

    dateQuery ={
        limit: 10,
        page: 1
    };

    locale= {
        emptyText: '暂无数据'
    };

    componentDidMount() {
        this.getList()
    }

    handleChange =(name,e)=> {
        this.setState({
            [name]: e.target.value
        })
    };

    keypress = (e) => {
        if (e.which ===13)
            return this.search()
    };
    click = (page,limit) => {
        this.dateQuery = {
            limit: limit,
            page: page
        };
        this.getList()
    };

    getList=()=> {
        this.setState({
            loading: true
        });
        getUser(this.dateQuery).then(res => {
            this.setState({
                dataSource: res.data,
                loading: false,
                total: res.total
            })
        })
    };
    handleSubmit=()=> {
        var data = {
          name: this.state.name,
          sex: this.state.sex,
          telephone: this.state.telephone,
          role: this.state.role
        };
        addUser(data).then(res => {
            this.setState({
                addVisible: false,
                name: '',
                sex: '',
                telephone: '',
                role: ''
            });
            this.getList()
        })
    };

    editEvent =(record) => {
        this.setState({
            editVisible: true,
            editName: record.name,
            editSex: record.sex,
            editRole: record.role,
            editTelephone: record.telephone,
            editId: record._id
        })
    };
    handleEdit=() => {
        var data = {
            name: this.state.editName,
            sex: this.state.editSex,
            telephone: this.state.editTelephone,
            role: this.state.editRole
        };
        updataUser(this.state.editId, data).then(res => {
            this.setState({
                editVisible: false
            });
            this.getList()
        })
    };

    deleteEvent=(record)=> {
        deleteUser(record._id).then(res => {
            this.getList()
        })
    };
    search=()=> {
        this.dateQuery.name = this.state.searchname;
        this.getList()
    };

    reset=()=>{
        this.dateQuery = {
            page: 1,
            limit: 10
        };
        this.setState({
          searchname: ''
        });
        this.getList()
    };

    resetPassword=(record)=>{
        restPassword(record._id).then(res => {
        })
    };

    render() {
        const columns = [
            {
                title:'编号',
                dataIndex:'_id',
                key:'_id',
            },
            {
                title:'用户名',
                dataIndex:'name',
                key:'name',
            },
            {
                title:'职位',
                dataIndex:'role',
                key:'role',
                render: (text,record) => {
                    if (record.role === 'teacher') {
                        return <span>讲师</span>
                    } else {
                        return <span>管理员</span>
                    }
                }
            },
            {
                title:'操作',
                render: (text, record) => {
                    return <div>
                        <Button type='primary' onClick={() => this.editEvent(record)}>编辑</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title="确定停用嘛?"
                            onConfirm={() => this.deleteEvent(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type='danger'>停用</Button>
                        </Popconfirm>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button style={{backgroundColor: 'rgb(230,162,60)', color: 'white'}} onClick={()=> this.resetPassword(record)}>重置密码</Button>
                    </div>
                }
            }

        ];
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
                    <div style={{fontSize:'26px'}}>用户管理</div>
                    <Divider style={{backgroundColor: 'white'}} />
                </div>
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的用户名"  type="text" value={this.state.searchname}
                           style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}}
                           onKeyPress={this.keypress}
                    />&nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={this.search} icon="search"
                    >查询</Button>&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div><br/>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Button type='primary' onClick={()=>this.setState({addVisible: true})}>+增加用户</Button>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Table dataSource={this.state.dataSource} columns={columns}
                           locale={this.locale} rowKey="_id" loading={this.state.loading}
                           pagination={ false }
                    />
                </div>
                <Pagination total={this.state.total} getNumer={this.click} />
                <Modal
                    title="增加"
                    width={600}
                    visible={this.state.addVisible}
                    okText='确认'
                    cancelText='取消'
                    onOk={this.handleSubmit}
                    onCancel={() => this.setState({addVisible: false})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='用户名：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.name} onChange={(e) => {this.handleChange('name', e)}}/>
                        </Form.Item>
                        <Form.Item label='密码：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span style={{color: 'red'}}>123456（默认密码 ）</span>
                        </Form.Item>
                        <Form.Item label='性别：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Radio.Group onChange={((e) => {this.handleChange('sex', e)})} value={this.state.sex}>
                                <Radio value={'男'}>男</Radio>
                                <Radio value={'女'}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='手机号码' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.telephone} onChange={(e) => {this.handleChange('telephone', e)}}/>
                        </Form.Item>
                        <Form.Item label='职务：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Radio.Group onChange={((e) => {this.handleChange('role', e)})} value={this.state.role}>
                                <Radio value={'admin'}>管理员</Radio>
                                <Radio value={'teacher'}>讲师</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="编辑"
                    width={600}
                    visible={this.state.editVisible}
                    okText='确认'
                    cancelText='取消'
                    onOk={this.handleEdit}
                    onCancel={() => this.setState({editVisible: false})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='用户名：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.editName} onChange={(e) => {this.handleChange('editName', e)}}/>
                        </Form.Item>
                        <Form.Item label='性别：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Radio.Group onChange={((e) => {this.handleChange('editSex', e)})} value={this.state.editSex}>
                                <Radio value={'男'}>男</Radio>
                                <Radio value={'女'}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='手机号码' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.editTelephone} onChange={(e) => {this.handleChange('editTelephone', e)}}/>
                        </Form.Item>
                        <Form.Item label='职务：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Radio.Group onChange={((e) => {this.handleChange('editRole', e)})} value={this.state.editRole}>
                                <Radio value={'admin'}>管理员</Radio>
                                <Radio value={'teacher'}>讲师</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

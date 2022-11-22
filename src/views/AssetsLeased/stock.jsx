import React from 'react'
import {Button, Divider, Input, Table, Modal, Form, Popconfirm} from "antd";
import { getStock, deleteStock, addStock,  updateStock } from '../../api/stock'
import Pagination from '../../components/pagination'

const { TextArea } = Input;

export default class Stock extends React.Component {

    state = {
        searchname: '',
        dataSource: [],
        loading: false,
        addVisible: false,
        editVisible: false,
        assentName: '',
        assentTotal: '',
        remarks: '',
        editName: '',
        editTotal: '',
        editRemarks: '',
        _id: '',
        total: 0
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

    handleChange=(name,e)=>{
        this.setState({[name]: e.target.value})
    };

    getList=()=> {
        this.setState({loading: true});
        getStock(this.dateQuery).then(res =>{
            for (let i =0; i< res.data.length; i++) {
                res.data[i].id = i+1+(this.dateQuery.page-1)*this.dateQuery.limit
            }
            this.setState({
                dataSource: res.data,
                loading: false,
                total: res.total
            })
        })
    };

    click = (page,limit) => {
        this.dateQuery = {
            limit: limit,
            page: page
        };
        console.log(this.dateQuery)
        this.getList()
    };

    search=()=> {
        this.dateQuery.name = this.state.searchname;
        this.getList()
    };

    reset=()=> {
        this.setState({searchname: ''});
        this.dateQuery = {
            page: 1,
            limit: 10
        };
        this.getList()
    };

    editEvent=(data) => {
        this.setState({
            editName: data.name,
            editTotal: data.total,
            editRemarks: data.remarks,
            editVisible: true,
            _id: data._id
        })
    };

    deleteEvent=(data) => {
        const _id = data._id;
        deleteStock(_id).then(res => {
            this.getList()
        })
    };

    handleSubmit = e => {
        const addData = {
            name: this.state.assentName,
            total: parseInt(this.state.assentTotal),
            remarks: this.state.remarks
        };
        addStock(addData).then(res => {
            this.setState({
                addVisible: false,
                assentName: '',
                assentTotal: '',
                remarks: ''
            });
            this.getList()
        })
    };

    editSubmit=() => {
        const data = {
            name: this.state.editName,
            total: parseInt(this.state.editTotal),
            remarks: this.state.editRemarks,
            _id: this.state._id
        };
        updateStock(data._id, data).then(res => {
            this.setState({
                editVisible: false
            });
            this.getList()
        })
    };

    render() {
        const columns = [
            {
                title:'编号',
                dataIndex:'id',
                key:'id',
            },
            {
                title:'资产名',
                dataIndex:'name',
                key:'name',
            },
            {
                title:'总量',
                dataIndex:'total',
                key:'total',
            },
            {
                title:'已租借量',
                dataIndex:'amount',
                key:'amount',
            },
            {
                title:'剩余量',
                dataIndex:'surplus',
                key:'surplus',
            },
            {
                title:'备注',
                dataIndex:'remarks',
                key:'remarks',
                render: (text, record) => {
                    if (record.remarks === '') {
                        return <span>无</span>
                    } else {
                        return <span>{record.remarks}</span>
                    }
                }
            },
            {
                title:'操作',
                render: (text, record) => {
                    return <div>
                        <Button type='primary' onClick={() => this.editEvent(record)}>编辑</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title="确定删除嘛?"
                            onConfirm={() => this.deleteEvent(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type='danger'>删除</Button>
                        </Popconfirm>
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
                <span style={{fontSize:25}}>资产库存1</span>
                <Divider style={{backgroundColor: 'white'}} />
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的资产名"  type="text" value={this.state.searchname} style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}} />&nbsp;&nbsp;&nbsp;
                    <Button type='primary' icon="search" onClick={this.search}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Button type='primary' onClick={()=>this.setState({addVisible: true})}>+增加资产</Button>
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
                        <Form.Item label='资产名称：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.assentName} onChange={(e) => {this.handleChange('assentName', e)}}/>
                        </Form.Item>
                        <Form.Item label='总量：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.assentTotal} onChange={(e) => {this.handleChange('assentTotal',e)}}/>
                        </Form.Item>
                        <Form.Item label='备注：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <TextArea  value={this.state.remarks} onChange={(e) => {this.handleChange('remarks', e)}}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="编辑"
                    width={600}
                    visible={this.state.editVisible}
                    okText='确认'
                    cancelText='取消'
                    onOk={this.editSubmit}
                    onCancel={() => this.setState({editVisible: false})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='资产名称：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.editName} onChange={(e) => {this.handleChange('editName', e)}}/>
                        </Form.Item>
                        <Form.Item label='总量：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <Input  value={this.state.editTotal} onChange={(e) => {this.handleChange('editTotal',e)}}/>
                        </Form.Item>
                        <Form.Item label='备注：' labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <TextArea  value={this.state.editRemarks} onChange={(e) => {this.handleChange('editRemarks', e)}}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

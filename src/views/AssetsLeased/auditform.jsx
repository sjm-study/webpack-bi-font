import React from 'react'
import {Table, Tag, Divider, Input, Button, Modal, Form } from "antd/lib/index";
import { AssentTotal, deleteAssent } from '../../api/assent'
import {isTrue, parseTime} from '../../utils'
import Pagination from '../../components/pagination'
import {Popconfirm} from "antd";


export default class AuditForm extends React.Component {

    state = {
        searchText: '',
        dataSource: [{ assent: [] }],
        loading: true,
        searchname: '',
        detailData: {audit_reason:[], assent: []},
        visible: false,
        show: false,
        total: 0

    };

    dateQuery ={
        limit: 10,
        page: 1
    };

    locale ={
        emptyText: '暂无数据'
    };

    detailEvent=(data) => {
        if (data.audit_reason.length ===0) {
            this.setState({
                visible: true,
                show: false,
                detailData: data
            });
        } else {
            this.setState({
                visible: true,
                show: true,
                detailData: data
            });
        }
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        this.getData();
    };

    handleChange=(name,e)=> {
        this.setState({[name]: e.target.value});
    };

    getData = ()=> {
        AssentTotal(this.dateQuery).then(res => {
            for (let i =0; i< res.data.length; i++) {
                res.data[i].id = i+1+(this.dateQuery.page-1)*this.dateQuery.limit
            }
            this.setState({dataSource: res.data, loading: false, total: res.total})
        })
    };

    search =() => {
        this.setState({loading:true});
        this.dateQuery.name = this.state.searchname;
        this.getData()
    };
    reset =() => {
        this.setState({searchname: '', loading: true});
        this.dateQuery = {
            page: 1,
            limit: 10
        };
        this.getData()
    };

    click = (page,limit) => {
        this.dateQuery = {
            limit: limit,
            page: page
        };
        this.getData()
    };

    deleteEvent =(record)=> {
        const _id = record._id;
        deleteAssent(_id).then(res => {
            this.getData()
        })
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
        const columns = [
            {
                title:'编号',
                dataIndex:'id',
                key:'id',
            },
            {
                title:'姓名',
                dataIndex:'name',
                key:'name',
            },
            {
                title:'资产',
                dataIndex:'assent',
                key:'assent',
                render: (text, record) => (
                    record.assent.map((item, index) => {
                        return <span key={index}>资产名：{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个数：{item.assent_num}<br/></span>
                    })
                )
            },
            {
                title:'用途',
                dataIndex:'purpose',
                key:'purpose'
            },
            {
                title:'租借日期',
                dataIndex:'lease_time',
                key:'lease_time',
                render: (text, record) => (
                    <span>{parseTime(record.lease_time)}</span>
                )
            },
            // {
            //     title: '申请时间',
            //     dataIndex: 'apply_time',
            //     key: 'apply_time'
            // },
            {
                title:'审核情况',
                dataIndex:'audit_situation',
                key:'audit_situation',
                render: (text, record, index) =>{
                    if (record.audit_situation === 0) return <Tag color="red">未审核</Tag>;
                    else if (record.audit_situation === 1) return <Tag color="green">通过</Tag>;
                    else return <Tag color="#2db7f5">不通过</Tag>
                }
            },
            {
                title:'是否领取',
                dataIndex:'receive_situation',
                key:'receive_situation',
                render: (text, record, index) =>{
                    if (record.receive_situation === 0) return <Tag color="red">否</Tag>;
                     else return <Tag color="green">是</Tag>
                }
            },
            {
                title:'是否归还',
                dataIndex:'return_situation',
                key:'return_situation',
                render: (text, record, index) =>{
                    if (record.return_situation === 0) return <Tag color="red">否</Tag>;
                    else return <Tag color="green">是</Tag>
                }
            },
            {
                title:'备注',
                dataIndex:'remarks',
                key:'remarks'
            },
            {
                title:'详情',
                dataIndex:'detail',
                key:'detail',
                render:(text,record) => {
                    return <div>
                        <Button type='primary' onClick={() => this.detailEvent(record)}>详情</Button>
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
        return (
            <div>
                <span style={{fontSize:25}}>资产租借情况</span>
                <Divider style={{backgroundColor: 'white'}} />
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的姓名"  type="text" value={this.state.searchname} style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}} />&nbsp;&nbsp;&nbsp;
                    <Button type='primary' icon="search" onClick={this.search}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Table dataSource={this.state.dataSource} columns={columns} locale={this.locale}
                           rowKey="_id" loading={this.state.loading}
                        pagination={ false }
                    />
                </div>
                <Pagination total={this.state.total} getNumer={this.click} />
                <Modal
                    title='详情信息'
                    visible={this.state.visible}
                    width={600}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="姓名：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.detailData.name}</span>
                        </Form.Item>
                        <Form.Item label="资产：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            {
                                this.state.detailData.assent.map((item, index) => (
                                    <span key={index}>资产名：{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个数：{item.assent_num}<br/></span>
                                ))
                            }
                        </Form.Item>
                        <Form.Item label="用途：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.detailData.purpose}</span>
                        </Form.Item>
                        <Form.Item label="审核情况：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{isTrue(this.state.detailData.audit_situation)}</span>
                        </Form.Item>
                        <Form.Item label="租借时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.detailData.lease_time)}</span>
                        </Form.Item>
                        <Form.Item label="申请时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.detailData.apply_time)}</span>
                        </Form.Item>
                        <Form.Item label="审核时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.detailData.audit_time)}</span>
                        </Form.Item>
                        <Form.Item label="领取时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.detailData.receive_time)}</span>
                        </Form.Item>
                        <Form.Item label="归还时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.detailData.return_time)}</span>
                        </Form.Item>
                        <Form.Item label="驳回理由：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0, display: this.state.show? "block": "none"}}>
                            {
                                this.state.detailData.audit_reason.map((item, index) => (
                                    <span key={index}>{parseTime(item.time)} ----- {item.reason}<br/></span>
                                ))
                            }
                        </Form.Item>
                        <Form.Item label="备注：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.detailData.remarks}</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

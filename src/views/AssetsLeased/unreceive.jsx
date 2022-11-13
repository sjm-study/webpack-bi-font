import React from 'react'
import {Button, Divider, Input, message, Modal, Table, Tag, Form} from "antd/lib/index";
import {CheckReceive, ReceiveSuccess} from "../../api/assent";
import {parseTime} from "../../utils";
import Pagination from '../../components/pagination'

export default class extends React.Component {

    state ={
        dataSource:[{assent: []}],
        searchname: '',
        loading: true,
        visible: false,
        receiveData: {assent: []},
        total: 0
    };

    dateQuery= {
        page: 1,
        limit: 10
    };

    locale ={
        emptyText: '暂无未领取'
    };

    auditEvent = (data) => {
        this.setState({
            visible: true,
            receiveData: data
        })
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
        this.submitReceive(this.state.receiveData._id)
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };


    handleChange=(name,e)=> {
        this.setState({[name]: e.target.value});
    };

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        CheckReceive(this.dateQuery).then(res=> {
            for (let i =0; i< res.data.length; i++) {
                res.data[i].id = i+1+(this.dateQuery.page-1)*this.dateQuery.limit
            }
            res.data.map(item =>{
                item.lease_time = parseTime(item.lease_time);
                item.apply_time = parseTime(item.apply_time);
                item.audit_time = parseTime(item.audit_time);
                return item
            });
            this.setState({dataSource: res.data, loading: false, total: res.total})
        })
    };

    click = (page,limit) => {
        this.dateQuery = {
            limit: limit,
            page: page
        };
        this.getData()
    };

    search =() => {
        this.setState({loading: true});
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

    submitReceive = (id) => {
        const time = parseTime(Date.now());
        const data = {
            _id: id,
            receive_time: time
        };
        ReceiveSuccess(data).then(res=> {
            message.info('领取成功');
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
        const columns=[
            {
                title:'编号',
                dataIndex:'id',
                key:'id',
            },
            {
                title:'姓名',
                dataIndex:'name',
                key:'name'
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
                key:'lease_time'
            },
            {
                title:'审核情况',
                dataIndex:'audit_situation',
                key:'audit_situation',
                render: (text,record) => {
                    if (record.audit_situation === 1) return <Tag color="green">已审核</Tag>;
                }
            },
            {
                title:'领取情况',
                dataIndex:'receive_situation',
                key:'receive_situation',
                render:(text,record) => (
                    <Button type="primary" onClick={() => this.auditEvent(record)}>
                        领取审核
                    </Button>
                )
            },
        ];
        return (
            <div>
                <span style={{fontSize:25}}>资产租借领取</span>
                <Divider style={{backgroundColor: 'white'}} />
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的姓名"  type="text" value={this.state.searchname} style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}} />&nbsp;&nbsp;&nbsp;
                    <Button type='primary' icon="search" onClick={this.search}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Table columns={columns} dataSource={this.state.dataSource} loading={this.state.loading}
                           locale={this.locale} rowKey='id' pagination={ false }
                    />
                </div>
                <Pagination total={this.state.total} getNumer={this.click} />
                <Modal
                    title='领取申请'
                    visible={this.state.visible}
                    width={600}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type='primary' onClick={this.handleOk}>确认领取</Button>,
                        <Button onClick={this.handleCancel}>取消</Button>
                    ]}

                >
                    <Form {...formItemLayout}>
                        <Form.Item label="姓名：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.receiveData.name}</span>
                        </Form.Item>
                        <Form.Item label="资产：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            {
                                this.state.receiveData.assent.map((item, index) => (
                                    <span key={index}>资产名：{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个数：{item.assent_num}<br/></span>
                                ))
                            }
                        </Form.Item>
                        <Form.Item label="用途：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.receiveData.purpose}</span>
                        </Form.Item>
                        <Form.Item label="租借时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.receiveData.lease_time}</span>
                        </Form.Item>
                        <Form.Item label="审核时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.receiveData.audit_time}</span>
                        </Form.Item>
                        <Form.Item label="领取时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(Date.now())}</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

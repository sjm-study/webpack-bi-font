import React from 'react'
import {Button, Divider, Input, message, Modal, Table, Form} from "antd/lib/index";
import { CheckAudit, SubmitAuditSuccess, SubmitAuditFail } from '../../api/assent'
import { parseTime } from '../../utils'
import Pagination from '../../components/pagination'


const {TextArea} = Input;

export default class Unaudited extends React.Component {

    state={
        dataSource :[{ assent: [] }],
        visible: false,
        poper:'',
        loading: true,
        searchname: '',
        auditData: {audit_reason: [], assent: []},
        audit_reason: '',
        show: false,
        total: 0
    };

    dateQuery ={
        limit: 10,
        page: 1
    };

    locale ={
        emptyText: '暂无未申请'
    };

    auditEvent = (data) => {
        if (data.audit_reason.length === 0) {
            this.setState({
                auditData: data,
                visible: true,
                show: false
            })
        } else {
            this.setState({
                auditData: data,
                visible: true,
                show: true
            })
        }

    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
        this.AuditComfornationSucess(this.state.auditData._id)
    };

    handleCancel = e => {
        if (this.state.audit_reason === '') {
            message.error('理由未填写');
        } else {
            this.setState({
                visible: false,
            });
            this.AuditComfornationFail(this.state.auditData._id,this.state.audit_reason)
        }
    };

    cancel= () => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        CheckAudit(this.dateQuery).then(res=> {
            for (let i =0; i< res.data.length; i++) {
                res.data[i].id = i+1+(this.dateQuery.page-1)*this.dateQuery.limit
            }
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

    AuditComfornationSucess = (id) => {
        this.setState({loading:true});
        const time = parseTime(Date.now());
        const data = {
            _id: id,
            audit_time: time
        };
        SubmitAuditSuccess(data).then(res=> {
            message.info('审核通过');
            this.getData()
        })
    };

    AuditComfornationFail = (id, audit_reason) => {
        this.setState({loading:true});
        const data = {
            _id: id,
            audit_reason: audit_reason,
            audit_time: parseTime(Date.now())
        };
        SubmitAuditFail(data).then(res => {
            message.info('审核不通过');
            this.getData()
        })
    };

    handleChange=(name,e)=> {
        this.setState({[name]: e.target.value});
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
                key:'lease_time',
                render: (text, record) => (
                    <span>{parseTime(record.lease_time)}</span>
                )
            },
            {
                title:'申请时间',
                dataIndex:'apply_time',
                key:'apply_time',
                render: (text, record) => (
                    <span>{parseTime(record.apply_time)}</span>
                )
            },
            {
                title:'审核情况',
                dataIndex:'audit_situation',
                key:'audit_situation',
                render:(text,record,index) =>(
                    <Button type="primary" onClick={() =>this.auditEvent(record)}>
                        审核
                    </Button>                )
            },
        ];
        return (
            <div>
                <span style={{fontSize:25}}>资产租借审核</span>
                <Divider style={{backgroundColor: 'white'}} />
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的姓名"  type="text" value={this.state.searchname} style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}} />&nbsp;&nbsp;&nbsp;
                    <Button type='primary' icon="search" onClick={this.search}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Table columns={columns} dataSource={this.state.dataSource}
                           locale={this.locale} loading={this.state.loading}
                           rowKey="_id" pagination={ false }
                    />
                </div>
                <Pagination total={this.state.total} getNumer={this.click} />
                <Modal
                    title='审核'
                    visible={this.state.visible}
                    width={600}
                    onCancel={this.cancel}
                    footer={[
                        <Button type='primary' onClick={this.handleOk}>审核通过</Button>,
                        <Button type='primary' onClick={this.handleCancel}>审核不通过</Button>,
                        <Button onClick={this.cancel}>取消</Button>
                    ]}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="姓名：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.auditData.name}</span>
                        </Form.Item>
                        <Form.Item label="资产：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            {
                                this.state.auditData.assent.map((item, index) => (
                                    <span key={index}>资产名：{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个数：{item.assent_num}<br/></span>
                                ))
                            }
                        </Form.Item>
                        <Form.Item label="租借时间：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{parseTime(this.state.auditData.lease_time)}</span>
                        </Form.Item>
                        <Form.Item label="用途：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.auditData.purpose}</span>
                        </Form.Item>
                        <Form.Item label="备注：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <span>{this.state.auditData.remarks}</span>
                        </Form.Item>
                        <Form.Item label="驳回理由：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0, display: this.state.show? "block": "none"}}>
                            {
                                this.state.auditData.audit_reason.map((item, index) => (
                                    <span key={index}>{parseTime(item.time)} ----- {item.reason}---{index}<br/></span>
                                ))
                            }
                        </Form.Item>
                        <Form.Item label="理由：" labelCol={{span: 3,offset: 3}} style={{marginBottom: 0}}>
                            <TextArea placeholder="若审核不通过，请填写理由" style={{width:300}} onChange={event => {this.handleChange('audit_reason', event)}}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

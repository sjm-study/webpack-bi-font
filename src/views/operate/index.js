import React from "react";
import {Button, Divider, Input, Table, DatePicker} from "antd";
import { getOperate } from '../../api/operate';
import Pagination from "../../components/pagination";
import { parseTime } from '../../utils/index'

const { RangePicker } = DatePicker;

export default class Main extends React.Component{
    state = {
        searchname: '',
        loading: false,
        dataSource: [],
        total: 0,
        name: '',
        start_time: '',
        end_time: '',
        keyValue: ''
    };
    dateQuery ={
        limit: 10,
        page: 1
    };
    componentDidMount() {
        this.getData()
    };

    handleChange=(name,e)=> {
        this.setState({[name]: e.target.value});
    };

    onChange=(date, dateString)=> {
        console.log(date, dateString);
        this.setState({
            start_time: dateString[0],
            end_time: dateString[1]
        })
    };

    getData=()=>{
        getOperate(this.dateQuery).then(res=> {
            this.setState({
                dataSource: res.data,
                total: res.total
            })
        })
    };
    search=() => {
        if (this.state.start_time === '') {
            this.dateQuery.name = this.state.searchname;
            this.getData()
        } else {
            if (this.state.searchname === '') {
                this.dateQuery.start_time = this.state.start_time;
                this.dateQuery.end_time = this.state.end_time;
                this.getData()
            } else {
                this.dateQuery.name = this.state.searchname;
                this.dateQuery.start_time = this.state.start_time;
                this.dateQuery.end_time = this.state.end_time;
                this.getData()
            }
        }
    };
    reset=()=>{
        this.setState({
            start_time: '',
            end_time: '',
            searchname: '',
            keyValue:new Date()
        });
        this.dateQuery = {
            limit: 10,
            page: 1
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
    render() {
        const columns = [
            {
                title:'编号',
                dataIndex:'_id',
                key:'_id',
            },
            {
                title:'登录用户名',
                dataIndex:'name',
                key:'name',
            },
            {
                title:'操作内容',
                dataIndex:'record',
                key:'recode',
            },
            {
                title:'ip地址',
                dataIndex:'ip',
                key:'ip',
            },
            {
                title:'操作时间',
                dataIndex:'operate_time',
                key:'operate_time',
                render:(text,record)=> {
                    return <span>{parseTime(record.operate_time)}</span>
                }
            },
        ];
        const locale = {
            emptyText: '暂无数据'
        };
        return (
            <div>
                <span style={{fontSize:25}}>系统操作日志</span>
                <Divider style={{backgroundColor: 'white'}} />
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Input placeholder="请输入你要查询的姓名"  type="text" value={this.state.searchname} style={{width: 250}} onChange={e => {this.handleChange('searchname',e)}} />&nbsp;&nbsp;&nbsp;
                    <RangePicker onChange={this.onChange} key={this.state.keyValue} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='primary' icon="search" onClick={this.search}>查询</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <Divider style={{backgroundColor: 'white'}} />
                <div style={{marginTop: '20px'}}>
                    <Table dataSource={this.state.dataSource} columns={columns} locale={locale}
                           rowKey="_id" loading={this.state.loading}
                           pagination={ false }
                    />
                </div>
                <Pagination total={this.state.total} getNumer={this.click} />
            </div>
        )
    }
}

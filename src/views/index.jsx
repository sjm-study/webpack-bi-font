import React from 'react'
import Line from '../components/echarts-line-modle'
import {Row, Col, Card, Table} from 'antd';
import '../css/index.css'
import {getUntreated, getHot} from '../api/laboratory'
import {parseTime} from "../utils";

export default class Index extends React.Component {

    state={
        audited: [],
        receive: [],
        revert: [],
        loading: false,
        day_tem: [],
        day_hum: []
    };
    locale ={
        emptyText: '暂无数据'
    };

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return ;
        };
    }

    getData = () => {
        this.setState({
            loading: true
        });
        getUntreated().then(res => {
            this.setState({
                audited: res.data.audited,
                receive: res.data.receive,
                loading: false
            })
        });
        getHot().then(res => {
            let tem = [];
            let hum = [];
            let time = [];
            res.data.map(item => {
                tem.push(parseFloat(item.temperature));
                hum.push(parseFloat(item.humidity));
                time.push(item.code.substr(5))
            });
            var obj_tem = {
                xSeries:time,
                series:{
                    name: '温度',
                    type: 'line',
                    data: tem
                }
            };
            var obj_hum = {
                xSeries:time,
                series:{
                    name: '湿度',
                    type: 'line',
                    data: hum
                }
            };
            this.setState({
                day_tem: obj_tem,
                day_hum: obj_hum
            })
        })
    };

    goAudited = () => {
        this.props.history.push('/main/audited/unaudited')
    };

    goReceive = () => {
        this.props.history.push('/main/audited/unreceive')
    };

    render() {

        const columns = [
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
                title:'租借日期',
                dataIndex:'lease_time',
                key:'lease_time',
                render: (text, record) => (
                    <span>{parseTime(record.lease_time)}</span>
                )
            }
            ];
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Card title="待审核" extra={<a onClick={this.goAudited}>More</a>} style={{ width: '95%',minHeight: 400 }}>
                            <Table dataSource={this.state.audited} columns={columns} locale={this.locale}
                                   rowKey="_id" loading={this.state.loading}
                                   pagination={ false }
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="待领取" extra={<a onClick={this.goReceive}>More</a>} style={{ width: '95%', minHeight: 400 }}>
                            <Table dataSource={this.state.receive} columns={columns} locale={this.locale}
                                   rowKey="_id" loading={this.state.loading}
                                   pagination={ false }
                            />
                        </Card>
                    </Col>
                </Row>
                <br/>
                <br/>
                <br/>
                {/*<Weather/>*/}
                <div>
                    <Row>
                        <Col span={12}><Line title='温度（近一周）℃' edata={this.state.day_tem} id='day_tem'/></Col>
                        <Col span={12}><Line title='湿度（近一周）RH' edata={this.state.day_hum} id='day_hum' /></Col>
                    </Row>
                </div>
            </div>
        )
    }
}

import React from 'react'
import Line from '../../../components/echarts-line-modle'
import {Col, Row, Spin } from "antd/lib/index";
import {Button, Select, Modal} from 'antd/lib/index'
import '../../../css/wenshidu_details.css'
import { nowTemHum, searchTH } from '../../../api/laboratory'
import { parseTime } from '../../../utils/index'

const { Option } = Select

export default class WenshiduDetails extends React.Component {
    state = {
        visible: false,
        temperature:'',
        humidity:'',
        time:'',
        loading: false,
        search: 'hour',
        hour_tem: {},
        hour_hum: {},
        hour_situation: false,
        day_tem: {},
        day_hum: {},
        day_situation: false,
        month_tem: {},
        month_hum: {},
        month_situation: false

    };

    componentDidMount() {
        this.getData()
    }


    componentWillUnmount() {
        this.setState = (state, callback) => {
            return ;
        };
    }

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

    showModal = () => {
        this.setState({
            loading: true,
            visible: true
        });
        nowTemHum({name:this.props.match.params.searchname}).then(res => {
            setTimeout(() => {
                this.setState({
                    time: parseTime(parseTime(res.time)),
                    temperature: res.temperature,
                    humidity: res.humidity,
                    loading: false
                });
            }, 3000);
        });
    };

    changeSelect = (value) => {
        this.setState({
            search: value
        });
    };

    search = () => {
        this.getData()
    };

    getData = () => {
        var data = {
            name: this.props.match.params.searchname,
            condition: this.state.search
        };
        if (this.state.search === 'hour') {
            let tem = [];
            let hum = [];
            searchTH(data).then(res => {
                res.data.map(item => {
                   tem.push(item.temperature);
                   hum.push(item.humidity);
                });
                var obj_tem = {
                    xSeries:['0','1', '2', '3', '4', '5', '6', '7','8','9','10','11', '12',
                        '13', '14', '15', '16', '17','18','19','20','21','22','23'],
                    series:{
                        name: '??????',
                        type: 'line',
                        data: tem
                    }
                };
                var obj_hum = {
                    xSeries:['0','1', '2', '3', '4', '5', '6', '7','8','9','10','11', '12',
                        '13', '14', '15', '16', '17','18','19','20','21','22','23'],
                    series:{
                        name: '??????',
                        type: 'line',
                        data: hum
                    }
                };
                this.setState({
                    hour_tem: obj_tem,
                    hour_hum: obj_hum,
                    hour_situation: true,
                    day_situation: false,
                    month_situation: false
                })
            })
        }
        else if (this.state.search === 'day') {
            let tem = [];
            let hum = [];
            let time = [];
            searchTH(data).then(res => {
                res.data.map(item => {
                    tem.push(parseFloat(item.temperature));
                    hum.push(parseFloat(item.humidity));
                    time.push(item.code.substr(5));
                    return item
                });
                var obj_tem = {
                    xSeries:time,
                    series:{
                        name: '??????',
                        type: 'line',
                        data: tem
                    }
                };
                var obj_hum = {
                    xSeries:time,
                    series:{
                        name: '??????',
                        type: 'line',
                        data: hum
                    }
                };
                this.setState({
                    day_tem: obj_tem,
                    day_hum: obj_hum,
                    day_situation: true,
                    hour_situation: false,
                    month_situation: false
                })
            })
        }
        else if (this.state.search === 'month') {
            let tem = [];
            let hum = [];
            let time = [];
            searchTH(data).then(res => {
                res.data.map(item => {
                    tem.push(parseFloat(item.temperature));
                    hum.push(parseFloat(item.humidity));
                    time.push(item.code);
                    return item
                });
                var obj_tem = {
                    xSeries:time,
                    series:{
                        name: '??????',
                        type: 'line',
                        data: tem
                    }
                };
                var obj_hum = {
                    xSeries:time,
                    series:{
                        name: '??????',
                        type: 'line',
                        data: hum
                    }
                };
                this.setState({
                    month_tem: obj_tem,
                    month_hum: obj_hum,
                    month_situation: true,
                    hour_situation: false,
                    day_situation: false
                })
            })
        }
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>????????????????????????</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Select defaultValue="hour" style={{ width: 120 }} onChange={this.changeSelect}>
                    <Option value="hour">??????</Option>
                    <Option value="day">???</Option>
                    <Option value="month">???</Option>
                </Select>&nbsp;&nbsp;
                <Button type="primary" onClick={this.search}>??????</Button>
                <br/><br/><br/>
                <Row style={{ display: this.state.hour_situation ? 'block' : 'none' }}>
                    <Col span={12}><Line title='??????  ???' edata={this.state.hour_tem} id='hour_tem'/></Col>
                    <Col span={12}><Line title='??????  RH' edata={this.state.hour_hum} id='hour_hum' /></Col>
                </Row>
                <Row style={{ display: this.state.day_situation ? 'block' : 'none' }}>
                    <Col span={12}><Line title='??????  ???' edata={this.state.day_tem} id='day_tem'/></Col>
                    <Col span={12}><Line title='??????  RH' edata={this.state.day_hum} id='day_hum' /></Col>
                </Row>
                <Row style={{ display: this.state.month_situation ? 'block' : 'none' }}>
                    <Col span={12}><Line title='??????  ???' edata={this.state.month_tem} id='month_tem'/></Col>
                    <Col span={12}><Line title='??????  RH' edata={this.state.month_hum} id='month_hum' /></Col>
                </Row>
                <Modal
                    title="????????????"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    okText="??????"
                    cancelText="??????"
                >
                    <Spin spinning={this.state.loading}>
                        <span>??????????????????{this.state.time}</span><br/>
                        <span>??????:{this.state.temperature}???</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>??????:{this.state.humidity}RH</span><br/>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

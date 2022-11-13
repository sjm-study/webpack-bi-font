import React from 'react'
import {Button, Divider, Input, Row, Col} from "antd/lib/index";
import '../../../css/montor.css'
import LiveImg from '../../../img/live.8df1b19b.jpg'
import MonitorImg from '../../../img/ezopen.9fbc862e.jpg'
export default class Monitor extends React.Component {

    state={
    };

    render() {
        return (
            <div>
                <div>
                    <div style={{fontSize:'26px'}}>监控</div>
                    <Divider style={{backgroundColor: 'white'}} />
                </div>
                <Row>
                    <Col span={12}>
                        <div className="item-container">
                            <div className="intro-item">
                                <a href='http://192.168.0.102/test/rtmp.html' target="_Blank">
                                    <div className="intro-item-img">
                                        <img src={LiveImg} alt="img" />
                                    </div>
                                    <div className="intro-detail">
                                        <div className="intro-detail-title">直播模式</div>
                                        <div className="intro-detail-text">
                                            <span>将摄像头的画面实时传输给用户，无需校验即可播放 </span></div>
                                        <Button type={"primary"}><a href='http://192.168.0.102/test/rtmp.html' target="_Blank">点击进入</a></Button>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="item-container">
                            <div className="intro-item">
                                <a href='http://192.168.0.102/demo/demo-monitor.html' target="_Blank">
                                    <div className="intro-item-img">
                                        <img src={MonitorImg} alt="img" />
                                    </div>
                                    <div className="intro-detail">
                                        <div className="intro-detail-title">监控模式</div>
                                        <div className="intro-detail-text">
                                            <span>用户校验后可实现低延迟，支持回放的监控视频播放 </span></div>
                                        <Button type={"primary"}><a href='http://192.168.0.102/demo/demo-monitor.html' target="_Blank">点击进入</a></Button>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

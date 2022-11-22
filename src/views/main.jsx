import React from 'react'
import { Layout, Menu, Icon, Dropdown } from 'antd';
import {Switch,Route,Link} from 'react-router-dom'
import '../css/main.css'
import Index from './index'
import Wenshidu from './laboratory/wenshidu/wenshidu'
import Monitor from './laboratory/monitor/monitor'
import LockManagement from './laboratory/lock/lockmanagement'
import AuditedForm from "./AssetsLeased/auditform";
import Unaudited from "./AssetsLeased/unaudited";
import Unreturn from "./AssetsLeased/unreturn";
import Unreceive from "./AssetsLeased/unreceive";
import Manger from './userManage/manger'
import User from './userManage/user'
import Stock from './AssetsLeased/stock'
import Operate from './operate/index'
import { connect } from 'react-redux'

import { loginout } from '../api/login'
import { del_info } from '../store/actions'

const {  Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

 class Main extends React.Component {

    state={
      arry: ['sub1'],
      app: ['sub1']
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.Change()
        }
    }

    componentDidMount() {
        if (!this.props.userInfo.name) {
            this.props.history.push('/register')
        }
    }

     Change = () => {
        if (this.props.location.pathname === '/main/stock' ||
            this.props.location.pathname === '/main/audited/auditedform' ||
            this.props.location.pathname === '/main/audited/unaudited' ||
            this.props.location.pathname === '/main/audited/unreceive' ||
            this.props.location.pathname === '/main/audited/unreturn'
        ) {
            this.setState({
                app: ['sub1', 'sub2']
            })
        }
    };

     loginout = () => {
        loginout().then(res => {
            this.props.del_info(res.data);
            this.props.history.push('/register')
        })
     };

     closeOne = () => {
       if (this.state.app.indexOf('sub1') > -1) { // 关闭
           if (this.state.app.indexOf('sub2') > -1) {
               if (this.state.app.indexOf('sub3') > -1){
                   this.setState({
                       app: ['sub2','sub3']
                   })
               } else {
                   this.setState({
                       app: ['sub2']
                   })
               }
           } else if (this.state.app.indexOf('sub3') > -1) {
               this.setState({
                   app: ['sub3']
               })
           } else {
               this.setState({
                   app: []
               })
           }
       } else { // 打开
           if (this.state.app.indexOf('sub2') > -1) {
               if (this.state.app.indexOf('sub3') > -1) {
                   this.setState({
                       app: ['sub2', 'sub1', 'sub3']
                   })
               } else {
                   this.setState({
                       app: ['sub2', 'sub1']
                   })
               }
           } else if (this.state.app.indexOf('sub3') > -1){
               this.setState({
                   app: ['sub1','sub3']
               })
           } else {
               this.setState({
                   app: ['sub1']
               })
           }
       }
     };

     closeTwo = () => {
         if (this.state.app.indexOf('sub2') > -1) { //关闭
             if (this.state.app.indexOf('sub1') > -1) {
                 if (this.state.app.indexOf('sub3') > -1) {
                     this.setState({
                         app: ['sub1','sub3']
                     })
                 } else {
                     this.setState({
                         app: ['sub1']
                     })
                 }
             } else if (this.state.app.indexOf('sub3') > -1){
                 this.setState({
                     app: ['sub3']
                 })
             } else {
                 this.setState({
                     app: []
                 })
             }
         } else { //打开
             if (this.state.app.indexOf('sub1') > -1) {
                 if (this.state.app.indexOf('sub3') > -1){
                     this.setState({
                         app: ['sub2', 'sub1','sub3']
                     })
                 } else {
                     this.setState({
                         app: ['sub2','sub1']
                     })
                 }
             } else if (this.state.app.indexOf('sub3') > -1){
                 this.setState({
                     app: ['sub2', 'sub3']
                 })
             } else {
                 this.setState({
                     app: ['sub2']
                 })
             }
         }
     };

     closeThree= () => {
         if (this.state.app.indexOf('sub3') > -1) { // 关闭
             if (this.state.app.indexOf('sub2') > -1) {
                 if (this.state.app.indexOf('sub1') > -1) {
                     this.setState({
                         app: ['sub2', 'sub1']
                     })
                 } else {
                     this.setState({
                         app: ['sub2']
                     })
                 }
             } else if (this.state.app.indexOf('sub1') > -1) {
                 this.setState({
                     app: ['sub1']
                 })
             } else {
                 this.setState({
                     app: []
                 })
             }
         } else { //打开
             if (this.state.app.indexOf('sub2') > -1) {
                 if (this.state.app.indexOf('sub1') > -1) {
                     this.setState({
                         app: ['sub1','sub2','sub3']
                     })
                 } else {
                     this.setState({
                         app: ['sub2','sub3']
                     })
                 }
             } else {
                 if (this.state.app.indexOf('sub1') > -1) {
                     this.setState({
                         app: ['sub1','sub3']
                     })
                 } else {
                     this.setState({
                         app: ['sub3']
                     })
                 }
             }
         }

     };

    render() {

        const menu = (
            <Menu>
                <Menu.Item>
                    <span rel="noopener noreferrer" onClick={this.loginout}>
                        注 销
                    </span>
                </Menu.Item>
            </Menu>
        );

        return (
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div style={{marginTop:15,textAlign:"center"}}>
                        <div>
                            <span style={{fontSize:18, color:'#ffffff'}}>计算机实验室环境监测</span>
                        </div>
                        <div style={{height:10}}/>
                    </div>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['/main/index']}
                          selectedKeys={this.props.location.pathname} openKeys={this.state.app}
                    >
                        <Menu.Item key='/main/index' >
                            <Link to='/main/index'>
                                <Icon type="database" />
                                <span className="nav-text">全站概览</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <div>
                                    <Icon type="home" />
                                    <span className="nav-text">实验室</span>
                                </div>
                            }
                            onTitleClick={this.closeOne}
                        >
                            <Menu.Item key='/main/laboratory/wenshidu'>
                                <Link to='/main/laboratory/wenshidu'>
                                    温湿度
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/laboratory/monitor'>
                                <Link to='/main/laboratory/monitor'>
                                    监控
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/lockmanagement'>
                                <Link to='/main/lockmanagement'>
                                    门锁管理
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key='sub2'
                            title={
                                <div>
                                    <Icon type="money-collect" />
                                    <span className="nav-text">&nbsp;资产租借</span>
                                </div>
                            }
                            onTitleClick={this.closeTwo}
                        >
                            <Menu.Item key='/main/stock'>
                                <Link to='/main/stock'>
                                    库存
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/audited/auditedform' >
                                <Link to='/main/audited/auditedform'>
                                    总表
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/audited/unaudited' >
                                <Link to='/main/audited/unaudited'>
                                    审核
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/audited/unreceive'>
                                <Link to='/main/audited/unreceive'>
                                    领取
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/audited/unreturn'>
                                <Link to='/main/audited/unreturn'>
                                    归还
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key='sub3'
                            title={
                                <div>
                                    <Icon type="solution" />
                                    <span className="nav-text">&nbsp;用户中心</span>
                                </div>
                            }
                            onTitleClick={this.closeThree}
                        >
                            <Menu.Item key='/main/userManger/manger'>
                                <Link to='/main/userManger/manger'>
                                    用户管理
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='/main/userManger/user'>
                                <Link to='/main/userManger/user'>
                                    修改密码
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key='/main/operate' >
                            <Link to='/main/operate'>
                                <Icon type="carry-out" />
                                <span className="nav-text">操作日志</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200, backgroundColor:'#f0f2f5'}}>
                    <Header style={{ background: '#fff', padding: 0, height: '56px' }}>
                        <div style={{ float: 'right', marginRight: '2%' }}>
                            <span>你好！ </span>
                            <Dropdown overlay={menu} trigger={['click']} >
                                <a className="ant-dropdown-link" href=" ">
                                    { this.props.userInfo.name } <Icon type="down" />
                                </a>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial'}}>
                        <div style={{ padding: 24, background: '#f0f2f5', minHeight: 600 }}>
                            <Switch>
                                <Route path='/main/operate' component={Operate}/>
                                <Route path='/main/index' component={Index}/>
                                <Route path='/main/laboratory/wenshidu' component={Wenshidu}/>
                                <Route path='/main/laboratory/monitor' component={Monitor}/>
                                <Route path='/main/lockmanagement' component={LockManagement}/>
                                <Route path='/main/audited/auditedform' component={AuditedForm}/>
                                <Route path='/main/audited/unaudited' component={Unaudited}/>
                                <Route path='/main/audited/unreturn' component={Unreturn}/>
                                <Route path='/main/audited/unreceive' component={Unreceive}/>
                                <Route path='/main/stock' component={Stock}/>
                                <Route path='/main/userManger/manger' component={Manger}/>
                                <Route path='/main/userManger/user' component={User} />
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', backgroundColor:'#f0f2f5'}}>
                        宁德师范学院<br/>
                        信息与机电工程学院
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}
export default connect(
    state => ({userInfo: state}),
    {del_info: del_info}
)(Main)

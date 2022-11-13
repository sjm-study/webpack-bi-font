import React from 'react'
import {Button, Divider, Input, Select} from "antd/lib/index";
import {Route} from 'react-router-dom'
import Unlockrecord from './unlockrecord'
import {getName} from "../../../api/laboratory";

const { Option } = Select;

export default class LockManagement extends React.Component {

    state={
        searchname:'',
        search_situation: false,
        situation: false,
        choiceData: []
    };
    componentDidMount() {
        getName().then(res=> {
            this.setState({
                choiceData: res.data
            })
        })
    }

    handleChange = (name,e) => {
        this.setState({[name]: e.target.value});
    };

    changeSelect = (value) => {
        this.setState({
            searchname: value
        });
    };

    search = () => {
        this.props.history.push(`/main/lockmanagement/unlockrecord/${this.state.searchname}`);
        this.setState({
            searchname: '',
            search_situation: true,
            situation: true
        });
    };

    keypress = (e) => {
        if (e.which ===13)
            return this.search()
    };

    reset = () => {
        this.setState({
            searchname: '',
            search_situation: false,
            situation: false
        });
        this.props.history.push(`/main/lockmanagement`);
    };

    render() {
        return (
            <div>
                <div>
                    <div style={{fontSize:'26px'}}>门锁管理</div>
                    <Divider style={{backgroundColor: 'white'}} />
                </div>
                <div>
                    <span style={{fontSize: '15px'}}>查询条件：</span>
                    <Select style={{ width: 200 }} onChange={this.changeSelect} disabled={this.state.situation} placeholder='请选择实验室名称'>
                        {
                            this.state.choiceData.map(item => (
                                <Option value={item.name}>{item.name}</Option>
                            ))
                        }
                    </Select>&nbsp;&nbsp;&nbsp;
                    <Button type='primary' onClick={this.search} icon="search"
                            style={{display: this.state.search_situation? 'none':'inline'}}
                    >查询</Button>&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div><br/>
                <Route path='/main/lockmanagement/unlockrecord/:searchname' component={Unlockrecord}/>
            </div>
        )
    }
}

import React from 'react'
import {Input,Button, Divider, Select} from 'antd/lib/index'
import {Route} from 'react-router-dom'
import { verificate, getName } from '../../../api/laboratory'
import WenshiduDetails from './wenshidu_details'

const { Option } = Select;

export default class Wenshidu extends React.Component {

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
        verificate({name: this.state.searchname}).then(res => {
            if (res.code === 1) {
            } else {
                this.props.history.push(`/main/laboratory/wenshidu/wenshududetails/${this.state.searchname}`);
                this.setState({
                    search_situation: true,
                    situation: true
                });
            }
        })
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
        this.props.history.push(`/main/laboratory/wenshidu`);
    };

    render() {
        return (
            <div>
                <div>
                    <div style={{fontSize:'26px'}}>温湿度</div>
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
                    <Button type='primary' icon="search" onClick={this.search}
                            style={{display: this.state.search_situation? 'none':'inline'}}
                    >查询</Button>&nbsp;&nbsp;&nbsp;
                    <Button type='danger' icon="redo" onClick={this.reset}>重置</Button>
                </div>
                <br/>
                <Divider style={{backgroundColor: 'white'}} />
                <Route path='/main/laboratory/wenshidu/wenshududetails/:searchname' component={WenshiduDetails}/>
            </div>
        )
    }
}

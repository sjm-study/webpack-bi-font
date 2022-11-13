import React, { Component } from 'react';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class EchartslineModle extends Component {
    // 更新数据重新初始化视图
    componentDidUpdate() {
        this.initChart();
    }
    // 首次加载初始化视图
    componentDidMount(){
        this.initChart();
    };
    initChart = () =>{
        let option = {
            title: {
                text: this.props.title,
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: this.props.edata.xSeries // 日期
            },
            yAxis: {
                type: 'value'
            },
            series: this.props.edata.series //
        };

        let myChart = echarts.init(document.getElementById(`${this.props.id}`));
        // 绘制图表
        myChart.setOption(option, true);
    };
    render() {
        return (
            <div id={`${this.props.id}`} style={{ width: 650, height: 400 }}/>
        );
    }
}

export default EchartslineModle;

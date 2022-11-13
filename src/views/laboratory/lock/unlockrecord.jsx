import React from 'react'
import { Table, Input, Button, Icon , Tag} from 'antd/lib/index';
import { getUnlock } from '../../../api/laboratory'

import '../../../css/wenshidu_details.css'
import Highlighter from "react-highlight-words";
import Pagination from "../../../components/pagination";
import {parseTime} from "../../../utils";


export default class UnlockRecord extends React.Component {

    state = {
        searchText: '',
        loading: false,
        dataList: [],
        total: 0,
        open: ''
    };
    dateQuery ={
        limit: 10,
        page: 1
    };
    componentDidMount() {
        this.getData()
    }

    getData=()=> {
        this.setState({loading: true});
        getUnlock(this.dateQuery).then(res => {
            res.data.list.map(item => {
                item.unlockDate = parseTime(new Date(item.unlockDate));
            });
            this.setState({
                dataList: res.data.list,
                total: res.data.total,
                loading: false,
                open: '已'
            })
        })
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
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
                title: '日期',
                dataIndex: 'unlockDate',
                key: 'unlockDate',
                width: '35%',
                ...this.getColumnSearchProps('unlockDate'),
            },
            {
                title: '姓名',
                dataIndex: 'username',
                key: 'username',
                // width: '20%',
                ...this.getColumnSearchProps('username'),
            },
            {
                title: '开锁情况',
                dataIndex: 'success',
                key: 'success',
                render:(text,record,index) => {
                    if (record.success === 1) {
                        return <Tag color="green">成功</Tag>
                    } else {
                        return <Tag color="red">失败</Tag>
                    }
                }
            },
        ];
        return (
            <div>
                <Table columns={columns} dataSource={this.state.dataList} loading={this.state.loading}
                       pagination={ false }/>
                <Pagination total={this.state.total} getNumer={this.click} />
            </div>
        )
    }
}

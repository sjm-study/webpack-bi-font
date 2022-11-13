import React from 'react'
import { Pagination } from 'antd';

class pagination extends React.Component {


    onShowSizeChange = (current, size) => {
        if (current === 0) {
            this.props.getNumer(1, size);
        } else {
            this.props.getNumer(current, size);
        }
    };
    onChange = (page, pageSize) => {
        this.props.getNumer(page, pageSize)
    };

    render() {
        return (
            <div style={{ display: this.props.total === 0 ? "none": "block" }}>
                <span>总共{ this.props.total }条</span>
                <Pagination
                    showSizeChanger
                    onChange={this.onChange}
                    onShowSizeChange = {this.onShowSizeChange}
                    total={this.props.total}
                    pageSizeOptions={['5', '10', '20']}
                />
            </div>
        )
    }
}
export default pagination

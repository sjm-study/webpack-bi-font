import React from 'react'
import {
  Input, Form, DatePicker, Button, Tabs, Divider, Table,
  Tag, Modal, Icon, Row, Col, InputNumber, Select,
  Dropdown, Menu, message, Spin
} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment'
import Pagination from '../../components/pagination'
import '../../css/teacher.css'
import { ApplyAssent, getUserAssent, getUserReject, updateAssent, getStock } from '../../api/teacher'
import { isTrue, parseTime } from '../../utils/index'
import { connect } from 'react-redux'
import { del_info } from '../../store/actions'
import { loginout } from "../../api/login";
import { changePassword } from '../../api/users'

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

let uuid = 1;


class NormalLoginForm extends React.Component {

  state = {
    name: '',
    assent: [],
    lease_time: '',
    purpose: '',
    remarks: '',
    assent_num: '',
    rejectData: [],
    allData: [],
    editVisible: false,
    _id: '',
    audit_reason: [],
    assentList: [],
    arry: [],
    visible: false,
    allLoading: false,
    rejectLoading: false,
    allTotal: 0,
    rejectTotal: 0,
    oldPassword: '',
    newPassword: '',
    comfirmPassword: '',
    changeVisible: false,
    allVisible: false,
    detailData: { assent: [], audit_reason: [] },
    loading: false
  };

  alllQuery = {
    page: 1,
    limit: 10
  };
  rejectQuery = {
    page: 1,
    limit: 10
  };

  allClick = (page, limit) => {
    this.alllQuery = {
      limit: limit,
      page: page
    };
    this.getAllData()
  };

  rejectClick = (page, limit) => {
    this.rejectQuery = {
      limit: limit,
      page: page
    };
    this.getRejectData()
  };


  componentDidMount() {
    if (!this.props.userInfo.name) {
      this.props.history.push('/register')
    } else {
      this.getAssentList();
      this.getAllData();
      this.getRejectData();
    }

  }

  getAssentList = () => {
    getStock().then(res => {
      this.setState({ assentList: res.data })
    })
  };

  getAllData = () => {
    this.alllQuery.real_name = this.props.userInfo.name;
    this.setState({ allLoading: true });
    getUserAssent(this.alllQuery).then(res => {
      res.data.map((item) => {
        item.apply_time = parseTime(item.apply_time);
        item.lease_time = parseTime(item.lease_time);
        return item
      });
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].id = i + 1 + (this.alllQuery.page - 1) * this.alllQuery.limit
      }
      this.setState({ allData: res.data, allLoading: false, allTotal: res.total })
    })
  };

  getRejectData = () => {
    this.rejectQuery.real_name = this.props.userInfo.name;
    this.setState({
      rejectLoading: true
    });
    getUserReject(this.rejectQuery).then(res => {
      res.data.map(item => {
        item.apply_time = parseTime(item.apply_time);
        item.lease_time = parseTime(item.lease_time);
        return item
      });
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].id = i + 1 + (this.rejectQuery.page - 1) * this.rejectQuery.limit
      }
      this.setState({ rejectData: res.data, rejectTotal: res.total, rejectLoading: false })
    })
  };

  handleChange = (name, e) => {
    this.setState({
      [name]: e.target.value,
    })
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ lease_time: dateString });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.lease_time = this.state.lease_time;
        const dataList = [];
        for (let i = 0; i < uuid; i++) {
          const start = values[`name_${i}`];
          const end = values[`Number_${i}`];
          dataList.push({
            assent_name: start,
            assent_num: end,
          });
        }
        values.assent = dataList;
        values.real_name = this.props.userInfo.name;
        this.setState({
          loading: true
        });
        ApplyAssent(values).then(res => {
          if (res.code === 0) {
            this.props.form.resetFields();
            this.setState({
              loading: false
            });
          } else if (res.code === 3) {
            this.setState({
              arry: res.data,
              visible: true,
              loading: false
            })
          }
        })
      }
    });
  };

  callback = (key) => {
    if (key === '2') {
      this.getRejectData();
    }
    if (key === '3') {
      this.getAllData();
    }
  };


  showEditModal = (data) => {
    this.setState({
      editVisible: true,
      name: data.name,
      assent: data.assent,
      lease_time: data.lease_time,
      purpose: data.purpose,
      remarks: data.remarks,
      assent_num: data.assent_num,
      _id: data._id,
      audit_reason: data.audit_reason
    })
  };

  handleOk = e => {
    const data = {
      _id: this.state._id,
      name: this.state.name,
      assent: this.state.assent,
      lease_time: this.state.lease_time,
      purpose: this.state.purpose,
      remarks: this.state.remarks
    };
    updateAssent(data).then(res => {
      this.getRejectData()
    })
    this.setState({
      editVisible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      editVisible: false,
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  loginout = () => {
    loginout().then(res => {
      this.props.del_info(res.data);
      this.props.history.push('/register')
    })
  };

  clickOk = () => {
    this.setState({
      visible: false
    })
  };

  clickCancel = () => {
    this.setState({
      visible: false
    })
  };

  changePassword = () => {
    if (this.state.newPassword === this.state.comfirmPassword) {
      var data = {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
        name: this.props.userInfo.name
      };
      changePassword(data).then(res => {
        if (res.code === 0) {
          this.setState({
            oldPassword: '',
            newPassword: '',
            comfirmPassword: '',
            changeVisible: false
          })
        }
      })
    } else {
      message.error('?????????????????????????????????')
    }
  };

  changeEvent = () => {
    this.setState({
      changeVisible: true
    })
  };

  cancelChange = () => {
    this.setState({
      changeVisible: false
    })
  };

  closeDetail = () => {
    this.setState({ allVisible: false })
  };
  detailEvent = (record) => {
    this.setState({ allVisible: true, detailData: record })
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div key={index}>
        <Form.Item
          {...formItemLayout}
          label='????????????'
          required={false}
          key={k.index || k.index === 0 ? k.index : k}
        >
          <Row>
            <Col span={6}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator(`name_${k}`, {
                  required: true
                })(
                  <Select style={{ width: 250 }}>
                    {
                      this.state.assentList.map((item, index) => {
                        return <Option key={index} value={item.name}>{item.name + '(' + item.surplus + ')'}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator(`Number_${k}`, {
                  required: true
                })(
                  <InputNumber style={{ width: 250 }} placeholder='??????' />
                )}
              </Form.Item>
            </Col>
            {keys.length > 1 ? (
              <span>
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />&nbsp;&nbsp;&nbsp;&nbsp;
                <Icon
                  className="dynamic-delete-button"
                  type="plus-circle"
                  onClick={() => this.add()}
                />
              </span>
            ) : <Icon
              className="dynamic-delete-button"
              type="plus-circle"
              onClick={() => this.add()}
            />}
          </Row>
        </Form.Item>
      </div>
    ));

    const columns_reject = [
      {
        title: '??????',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '??????',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '??????',
        dataIndex: 'assent',
        key: 'assent',
        render: (text, record) => (
          record.assent.map((item, index) => {
            return <span key={index}>????????????{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;?????????{item.assent_num}<br /></span>
          })
        )
      },
      {
        title: '??????',
        dataIndex: 'purpose',
        key: 'purpose'
      },
      {
        title: '????????????',
        dataIndex: 'lease_time',
        key: 'lease_time'
      },
      {
        title: '????????????',
        dataIndex: 'apply_time',
        key: 'apply_time'
      },
      {
        title: '????????????',
        dataIndex: 'audit_situation',
        key: 'audit_situation',
        render: (text, record) => {
          if (record.audit_situation === 0) return <Tag color="red">?????????</Tag>;
          else if (record.audit_situation === 1) return <Tag color="green">??????</Tag>;
          else return <Tag color="#2db7f5">?????????</Tag>
        }
      },
      {
        title: '??????',
        render: (text, record) => (
          <Button type="primary" size={"small"} onClick={() => this.showEditModal(record)}>
            ??????
          </Button>
        )
      }
    ];
    const columns_all = [
      {
        title: '??????',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '??????',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '??????',
        dataIndex: 'assent',
        key: 'assent',
        render: (text, record) => (
          record.assent.map((item, index) => {
            return <span key={index}>????????????{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;?????????{item.assent_num}<br /></span>
          })
        )
      },
      {
        title: '??????',
        dataIndex: 'purpose',
        key: 'purpose'
      },
      {
        title: '????????????',
        dataIndex: 'lease_time',
        key: 'lease_time'
      },
      {
        title: '????????????',
        dataIndex: 'apply_time',
        key: 'apply_time'
      },
      {
        title: '????????????',
        dataIndex: 'audit_situation',
        key: 'audit_situation',
        render: (text, record, index) => {
          if (record.audit_situation === 0) return <Tag color="red">?????????</Tag>;
          else if (record.audit_situation === 1) return <Tag color="green">??????</Tag>;
          else return <Tag color="#2db7f5">?????????</Tag>
        }
      },
      {
        title: '????????????',
        dataIndex: 'receive_situation',
        key: 'receive_situation',
        render: (text, record, index) => {
          if (record.receive_situation === 0) return <Tag color="red">???</Tag>;
          else return <Tag color="green">???</Tag>
        }
      },
      {
        title: '????????????',
        dataIndex: 'return_situation',
        key: 'return_situation',
        render: (text, record, index) => {
          if (record.return_situation === 0) return <Tag color="red">???</Tag>;
          else return <Tag color="green">???</Tag>
        }
      },
      {
        title: '??????',
        dataIndex: 'detail',
        key: 'detail',
        render: (text, record) => {
          return <Button type={"primary"} onClick={() => this.detailEvent(record)}>??????</Button>
        }
      }
    ];

    const menu = (
      <Menu>
        <Menu.Item>
          <span rel="noopener noreferrer" onClick={this.loginout}>
            ??? ???
          </span>
        </Menu.Item>
        <Menu.Item>
          <span rel="noopener noreferrer" onClick={this.changeEvent}>
            ????????????
          </span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="??????" key="1">
            <div style={{ float: 'right', marginRight: '2%' }}>
              <span>????????? </span>
              <Dropdown overlay={menu} trigger={['click']} >
                <a className="ant-dropdown-link" href=" ">
                  {this.props.userInfo.name} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
            <div className='teacher-title' style={{ fontSize: '37px', paddingTop: '20px', marginLeft: '15%' }}>????????????</div>
            <Divider />
            <Spin spinning={this.state.loading}>
              <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form" >
                <Form.Item label="?????????">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '???????????????' }]
                  })(
                    <Input style={{ width: 250 }} onChange={e => { this.handleChange('name', e) }} />
                  )}
                </Form.Item>
                {formItems}
                <Form.Item label="???????????????">
                  {getFieldDecorator('lease_time', {
                    rules: [{ required: true, message: '?????????????????????' }]
                  })(
                    <DatePicker onChange={this.onChange} locale={locale} style={{ width: 250 }} showTime placeholder="????????????"

                    />
                  )}
                </Form.Item>
                <Form.Item label="?????????">
                  {getFieldDecorator('purpose', {
                    rules: [{ required: true, message: '???????????????' }]
                  })(
                    <TextArea style={{ width: 250 }} onChange={e => { this.handleChange('purpose', e) }} />
                  )}
                </Form.Item>
                <Form.Item label="?????????">
                  {getFieldDecorator('remarks', {
                    rules: [{ required: false }]
                  })(
                    <TextArea style={{ width: 250 }} onChange={e => { this.handleChange('remarks', e) }} />
                  )}
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button type='primary' onClick={this.handleSubmit} style={{ marginLeft: 160, width: 90 }} >??????</Button>
                </Form.Item>
              </Form>
            </Spin>
          </TabPane>
          <TabPane tab="??????" key="2">
            <div style={{ float: 'right', marginRight: '2%' }}>
              <span>????????? </span>
              <Dropdown overlay={menu} trigger={['click']} >
                <a className="ant-dropdown-link" href=" ">
                  {this.props.userInfo.name} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
            <div style={{ fontSize: '37px', paddingTop: '20px', marginLeft: '15%' }}>????????????</div>
            <Divider />
            <Table columns={columns_reject} dataSource={this.state.rejectData} rowKey='_id' style={{ width: '90%', margin: '0 auto' }}
              pagination={false} bordered loading={this.state.rejectLoading} />
            <div style={{ width: '90%', marginLeft: '5%' }}>
              <Pagination total={this.state.rejectTotal} getNumer={this.rejectClick} />
            </div>
          </TabPane>
          <TabPane tab="??????" key="3">
            <div style={{ float: 'right', marginRight: '2%' }}>
              <span>????????? </span>
              <Dropdown overlay={menu} trigger={['click']} >
                <a className="ant-dropdown-link" href=" ">
                  {this.props.userInfo.name} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
            <div style={{ fontSize: '37px', paddingTop: '20px', marginLeft: '15%' }}>????????????</div>
            <Divider />
            <Table columns={columns_all} dataSource={this.state.allData} rowKey='_id' style={{ width: '90%', margin: '0 auto' }}
              pagination={false} loading={this.state.allLoading} bordered />
            <div style={{ width: '90%', marginLeft: '5%' }}>
              <Pagination total={this.state.allTotal} getNumer={this.allClick} />
            </div>
          </TabPane>
        </Tabs>
        <Modal
          title="????????????"
          visible={this.state.editVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="??????"
          cancelText="??????"
        >
          <Form {...formItemLayout}>
            <Form.Item label="?????????">
              <Input style={{ width: 250 }} type='text' value={this.state.name} onChange={e => { this.handleChange('name', e) }} />
            </Form.Item>
            <Form.Item label="?????????">
              {
                this.state.assent.map((item, index) => {
                  return <span key={index}>{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;?????????{item.assent_num}<br /></span>
                })
              }
            </Form.Item>
            {/*<Form.Item label="?????????">*/}
            {/*    <Input style={{width:250}} value={this.state.assent_num} onChange={e => {this.handleChange('assent_num',e)}}/>*/}
            {/*</Form.Item>*/}
            <Form.Item label="???????????????">
              <DatePicker onChange={this.onChange} value={moment(this.state.lease_time, 'YYYY-MM-DD HH:mm:ss')} locale={locale} style={{ width: 250 }} showTime placeholder="????????????" />
            </Form.Item>
            <Form.Item label="?????????">
              <TextArea style={{ width: 250 }} value={this.state.purpose} onChange={e => { this.handleChange('purpose', e) }} />
            </Form.Item>
            <Form.Item label="?????????">
              <TextArea style={{ width: 250 }} value={this.state.remarks} onChange={e => { this.handleChange('remarks', e) }} />
            </Form.Item>
            <Form.Item label="???????????????" style={{ display: this.state.audit_reason.length === 0 ? 'none' : 'block' }}>
              {
                this.state.audit_reason.map((item) => {
                  return <span>{parseTime(item.time)} ----- {item.reason}<br /></span>
                })
              }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="??????"
          visible={this.state.visible}
          onOk={this.clickOk}
          onCancel={this.clickCancel}
          okText="??????"
          cancelText="??????"
          keyboard={false}
          centered={true}
          closable={false}
          maskClosable={false}
        >
          <span>
            {
              this.state.arry.map((item, index) => {
                return <span key={index}>????????????{item.assent_name}&nbsp;&nbsp;&nbsp;????????????{item.amount}<br /></span>
              })
            }
            <span>???????????????????????????????????????????????????!
            </span>
          </span>
        </Modal>
        <Modal
          title="????????????"
          visible={this.state.changeVisible}
          onOk={this.changePassword}
          onCancel={this.cancelChange}
          okText="??????"
          cancelText="??????"
          keyboard={false}
          centered={true}
          closable={false}
          maskClosable={false}
        >
          <Form {...formItemLayout}>
            <Form.Item label='????????????' labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <Input type={'password'} value={this.state.oldPassword} onChange={(e) => { this.handleChange('oldPassword', e) }} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label='????????????' labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <Input type={'password'} value={this.state.newPassword} onChange={(e) => { this.handleChange('newPassword', e) }} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label='???????????????' labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <Input type={'password'} value={this.state.comfirmPassword} onChange={(e) => { this.handleChange('comfirmPassword', e) }} style={{ width: 200 }} />
            </Form.Item><br />
          </Form>
        </Modal>
        <Modal
          title="??????"
          visible={this.state.allVisible}
          onOk={this.closeDetail}
          onCancel={this.closeDetail}
          okText="??????"
          cancelText="??????"
        >
          <Form {...formItemLayout}>
            <Form.Item label="?????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{this.state.detailData.name}</span>
            </Form.Item>
            <Form.Item label="?????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              {
                this.state.detailData.assent.map((item, index) => (
                  <span key={index}>????????????{item.assent_name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;?????????{item.assent_num}<br /></span>
                ))
              }
            </Form.Item>
            <Form.Item label="?????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{this.state.detailData.purpose}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{isTrue(this.state.detailData.audit_situation)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{parseTime(this.state.detailData.lease_time)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{parseTime(this.state.detailData.apply_time)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{parseTime(this.state.detailData.audit_time)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{parseTime(this.state.detailData.receive_time)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{parseTime(this.state.detailData.return_time)}</span>
            </Form.Item>
            <Form.Item label="???????????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0, display: this.state.show ? "block" : "none" }}>
              {
                this.state.detailData.audit_reason.map((item, index) => (
                  <span key={index}>{parseTime(item.time)} ----- {item.reason}<br /></span>
                ))
              }
            </Form.Item>
            <Form.Item label="?????????" labelCol={{ span: 3, offset: 3 }} style={{ marginBottom: 0 }}>
              <span>{this.state.detailData.remarks}</span>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default connect(
  state => ({ userInfo: state }),
  { del_info: del_info }
)(WrappedNormalLoginForm)


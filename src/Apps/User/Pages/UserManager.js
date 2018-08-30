import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Spin,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Row,
  Col,
  InputNumber,
  DatePicker,
} from 'antd';
import UserListTable from '../Components/UserListTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './UserManager.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, roleLoading, roleOptions } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue);
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="添加用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Spin spinning={roleLoading}>
        <Form>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="用户名">
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '请输入5-20位字母数字组成的用户名' },
                { pattern: /^[\w]{5,20}$/, message: '请输入5-20位字母数字组成的用户名' },
              ],
            })(<Input placeholder="5-20位字母数字下划线组成的用户名" />)}
          </FormItem>

          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="nickname">
            {getFieldDecorator('nickname', {
              rules: [
                { required: true, message: '请输入昵称' },
                { pattern: /^[\u4e00-\u9fa5\w]{2,10}$/, message: '请输入2-10位昵称' },
              ],
            })(<Input placeholder="请输入昵称" />)}
          </FormItem>

          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="角色">
            {getFieldDecorator('role_id', {
              rules: [{ required: true, message: '请选择角色' }, { pattern: /^[\d]{1,5}$/ }],
            })(<Select style={{ width: 120 }}>{roleOptions}</Select>)}
          </FormItem>

          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="登录密码">
            {getFieldDecorator('password1', {
              rules: [
                { required: true, message: '请输入登录密码' },
                {
                  pattern: /^([A-Z]|[a-z]|[0-9]|[-=[;,./~!@#$%^*()_+}{:?]){6,20}$/,
                  message: '8-20位并包含大小字母数字',
                },
              ],
            })(<Input placeholder="请输入密码" type="password" />)}
          </FormItem>

          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="登录密码">
            {getFieldDecorator('password2', {
              rules: [
                { required: true, message: '请再次输入登录密码' },
                {
                  pattern: /^([A-Z]|[a-z]|[0-9]|[-=[;,./~!@#$%^*()_+}{:?]){6,20}$/,
                  message: '8-20位并包含大小字母数字',
                },
              ],
            })(<Input placeholder="请再次输入密码" type="password" />)}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
});

@connect(state => ({
  User: state.User,
  Role: state.Role,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    sorter: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'User/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const query = {};
    if (sorter.field) {
      query.sorter = {
        field: sorter.field,
        order: sorter.order,
      };
    }
    query.pagination = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(query, this.fetch);
  };

  fetch = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const query = {
      currentPage: this.state.pagination.currentPage,
      pageSize: this.state.pagination.pageSize,
      ...formValues,
      ...this.state.sorter,
    };
    dispatch({
      type: 'User/list',
      payload: query,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'User/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  handleModalVisible = flag => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: !!flag,
    });
    if (flag) {
      dispatch({
        type: 'Role/list',
      });
    }
  };
  handleAdd = values => {
    const { dispatch } = this.props;
    const fetch = this.fetch;
    fetch.bind(this);

    if (values.password1 != values.password2) {
      message.error('两次密码不一致！');
      return;
    }
    dispatch({
      type: 'User/add',
      payload: {
        username: values.username,
        nickname: values.nickname,
        role_id: values.role_id,
        password: values.password1,
      },
      success: () => {
        message.success('添加成功');
        this.setState({
          modalVisible: false,
        });
        fetch();
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      const values = {
        username: fieldsValue.search_username,
        status: fieldsValue.search_status,
        sex: fieldsValue.search_sex,
        // createdAt: fieldsValue.search_createdAt && fieldsValue.search_createdAt.valueOf(),
      };
      console.log(values);

      this.setState(
        {
          formValues: values,
          pagination: {
            currentPage: 1,
            pageSize: 10,
          },
        },
        this.fetch
      );
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('search_username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('search_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">正常</Option>
                  <Option value="1">禁止</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('search_username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('search_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">正常</Option>
                  <Option value="1">禁止</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('search_sex')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">保密</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const {
      User: { loading: userLoading, data },
      Role: { loading: roleLoading, list: roleList },
    } = this.props;
    const { selectedRows, modalVisible, addInputValue } = this.state;
    const { getFieldDecorator } = this.props.form;

    const roleOptions = [];
    roleList.forEach(function(item) {
      roleOptions.push(
        <Option value={item.id} key={item.id}>
          {item.name}
        </Option>
      );
    });

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      roleLoading: roleLoading,
      roleOptions: roleOptions,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <UserListTable
              selectedRows={selectedRows}
              loading={userLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}

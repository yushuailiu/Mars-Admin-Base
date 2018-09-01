import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Modal, Input, message, InputNumber } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FriendLinkTable from '../Components/FriendLinkTable';

const FormItem = Form.Item;

@connect(state => ({
  FriendLink: state.FriendLink,
}))
@Form.create()
export default class FriendLink extends PureComponent {
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
      type: 'FriendLink/list',
    });
  }

  updateStatusById = (id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'FriendLink/updateStatusById',
      payload: {
        id,
        status,
      },
      success: () => {
        this.fetch();
      },
    });
  };

  handleAdd = () => {
    const { dispatch, form } = this.props;

    const fetch = this.fetch.bind(this);
    form.validateFields((err, values) => {
      if (err) {
        return err;
      } else {
        dispatch({
          type: 'FriendLink/add',
          payload: values,
          success: () => {
            message.success('添加成功');
            this.setState({
              modalVisible: false,
            });
            fetch();
          },
        });
      }
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  updateInfo(payload, success, fail) {
    const { dispatch } = this.props;
    if (payload && payload.sort) {
      payload.sort = parseInt(payload.sort, 10);
    }
    dispatch({
      type: 'FriendLink/update',
      payload,
      success: () => {
        this.fetch();
        success();
      },
      fail: () => {
        fail();
      },
    });
  }

  fetch() {
    const { dispatch } = this.props;
    const { formValues, pagination, sorter } = this.state;
    const query = {
      ...pagination,
      ...formValues,
      ...sorter,
    };
    dispatch({
      type: 'FriendLink/list',
      payload: query,
    });
  }

  addFriendLink(flag) {
    this.setState({
      modalVisible: !!flag,
    });
  }

  render() {
    const { selectedRows, modalVisible } = this.state;
    const {
      FriendLink: { loading, data },
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <div>
            <Button icon="plus" type="primary" onClick={() => this.addFriendLink(true)}>
              添加友情链接
            </Button>
          </div>
          <FriendLinkTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            onDelete={this.updateStatusById}
            updateInfo={this.updateInfo.bind(this)}
          />
        </Card>

        <Modal
          title="添加友情链接"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="链接名">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入链接名' },
                  { pattern: /^[\s\S]{1,15}$/, message: '请输入链接名' },
                ],
              })(<Input placeholder="请输入链接名" />)}
            </FormItem>
          </Form>
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="url">
              {getFieldDecorator('url', {
                rules: [
                  { required: true, message: '请输入链接地址' },
                  { type: 'url', message: '请输入正确链接地址' },
                ],
              })(<Input placeholder="请输入链接名" />)}
            </FormItem>
          </Form>
          <Form>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="排序权重">
              {getFieldDecorator('sort', {
                rules: [
                  { required: true, message: '请输入整数权重' },
                  { type: 'number', message: '请输入整数权重' },
                ],
                initialValue: 0,
              })(<InputNumber placeholder="请输入权重" />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}

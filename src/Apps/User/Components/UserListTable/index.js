import React, { PureComponent } from 'react';
import { Table, Alert, Divider } from 'antd';
import styles from './index.less';

class UserListTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {
      data: { list, pagination },
      loading,
    } = this.props;

    const columns = [
      {
        sorter: true,
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
      },
      {
        sorter: true,
        title: '用户状态',
        dataIndex: 'status',
        render: val => (val === 0 ? '正常' : '禁止'),
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        render: (val, record) => (
          <div>
            <img alt={record.nickname} src={val} className={styles.avatar} />
          </div>
        ),
      },
      {
        title: '操作',
        render: (text, record) => {
          let changeStatus = '';
          const { updateStatus } = this.props;
          if (record.status === 0) {
            changeStatus = <a onClick={() => updateStatus(1, [record.id])}>禁止</a>;
          } else {
            changeStatus = <a onClick={() => updateStatus(0, [record.id])}>取消禁止</a>;
          }
          return (
            <div>
              {changeStatus}
              <Divider type="vertical" />
              <span>编辑</span>
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.UserListTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default UserListTable;

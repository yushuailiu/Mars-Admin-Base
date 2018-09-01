import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';
import EditableCell from '../../../../components/EditableCell';

class CategoryManagerTable extends PureComponent {
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

  onCellChange = (id, field) => {
    const { updateInfo } = this.props;
    return (text, success, fail) => {
      const payload = {};
      payload.id = id;
      payload[field] = text;
      return updateInfo(payload, success, fail);
    };
  };

  handleTableDelete = (id, status, e) => {
    e.preventDefault();
    const { onDelete } = this.props;
    onDelete(id, status);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {
      data: { list, pagination },
      loading,
    } = this.props;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '链接名',
        dataIndex: 'name',
        width: 150,
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.id, 'name')} />
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => {
          if (text === 1) {
            return '下线';
          } else {
            return '在线';
          }
        },
      },
      {
        title: '链接地址',
        dataIndex: 'url',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.id, 'url')} />
        ),
      },
      {
        title: '排序权重',
        dataIndex: 'sort',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.id, 'sort')} />
        ),
      },
      {
        title: '操作',
        render: (text, record) => {
          let changeStatus = '';
          if (record.status === 0) {
            changeStatus = (
              <a href="" onClick={e => this.handleTableDelete(record.id, 1, e)}>
                下线
              </a>
            );
          } else {
            changeStatus = (
              <a href="" onClick={e => this.handleTableDelete(record.id, 0, e)}>
                取消下线
              </a>
            );
          }
          return <Fragment>{changeStatus}</Fragment>;
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
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
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default CategoryManagerTable;

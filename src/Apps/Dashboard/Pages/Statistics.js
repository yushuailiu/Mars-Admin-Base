/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Row, Col, Avatar } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditableLinkGroup from '../../../components/EditableLinkGroup';
import styles from './Statistics.less';

@connect(state => ({
  Statistics: state.Statistics,
  Login: state.Login,
}))
export default class Statistics extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Statistics/statistics',
    });
  }

  render = () => {
    const links = [
      {
        title: '管理后台人员',
        href: '/blog/manage',
      },
      {
        title: '添加友情链接',
        href: '/site/friendLink',
      },
    ];
    const {
      Login: {
        currentUser: { userInfo },
      },
      Statistics: { data },
    } = this.props;

    let pageHeaderContent = <div />;
    if (userInfo) {
      pageHeaderContent = (
        <div>
          <div className={styles.pageHeaderContent}>
            <Avatar className={styles.avatar} size="large" src={userInfo.avatar} />
            你好，
            {userInfo.nickname}
          </div>
        </div>
      );
    }
    let list = <div />;
    list = (
      <Card title="进行中的项目" bordered={false}>
        <Card.Grid>
          <Card className={styles.card}>
            <div>
              管理员
              <span>{data.adminCount}</span>人
            </div>
          </Card>
        </Card.Grid>
      </Card>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent}>
        <Row gutter={24}>
          <Col xl={14} lg={24} md={24} sm={24} xs={24}>
            {list}
          </Col>
          <Col xl={10} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  };
}

/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditableLinkGroup from '../../../components/EditableLinkGroup';
import { Spin, Card, Row, Col, Avatar } from 'antd';
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
        title: '管理博客',
        href: '/blog/manage',
      },
      {
        title: '文章管理',
        href: '/article/manage',
      },
      {
        title: '开源项目管理',
        href: '/openSource/manage',
      },
      {
        title: '活动管理',
        href: '/activity/manage',
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
      Statistics: { data, loading },
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
    if (data.userNum) {
      list = (
        <Card title="进行中的项目" bordered={false}>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                会员
                <span>{data.userNum}</span>人
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                在线博客
                <span>{data.blogOnlineNum}</span>篇
              </div>
              <div>
                删除博客
                <span>{data.blogDelNum}</span>篇
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                在线文章
                <span>{data.articleOnlineNum}</span>篇
              </div>
              <div>
                删除文章
                <span>{data.articleDelNum}</span>篇
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                总活动
                <span>{data.activityTotalNum}</span>个
              </div>
              <div>
                未结束活动
                <span>{data.activityOnlineNum}</span>个
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                开源项目
                <span>{data.openSourceNum}</span>个
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                评论
                <span>{data.commentNum}</span>条
              </div>
            </Card>
          </Card.Grid>

          <Card.Grid>
            <Card className={styles.card}>
              <div>
                投票
                <span>{data.voteNum}</span>次
              </div>
            </Card>
          </Card.Grid>
          <Card.Grid>
            <Card className={styles.card}>
              <div>
                图片
                <span>{data.imageNum}张</span>
              </div>
            </Card>
          </Card.Grid>
        </Card>
      );
    }

    return (
      <PageHeaderLayout content={pageHeaderContent}>
        <Row gutter={24}>
          <Spin spinning={loading}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              {list}
            </Col>
          </Spin>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
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

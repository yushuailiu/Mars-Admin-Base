import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../Components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ Login, loading }) => ({
  Login,
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { history } = this.props;
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'Login/login',
        payload: {
          ...values,
          type,
        },
        success: function() {
          history.push('/');
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const {
      Login: { loading },
    } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            <UserName name="identifier" placeholder="username" />
            <Password name="credential" placeholder="password" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <Submit loading={loading}>登录</Submit>
        </Login>
      </div>
    );
  }
}

import React from 'react';
import { Router, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { AuthorizeRouteComponent } from './components/Auth/AuthorizeRoute';

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Redirect exact from="/" to="/dashboard/statistics" />
          <AuthorizeRouteComponent history={history} path='/' />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

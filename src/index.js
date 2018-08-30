import './polyfill';
import dva from 'dva';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
});
window.app = app;
// 2. Plugins
app.use(createLoading());

// 3. Register global model
// todo Global名称修改，这里后面如果做notify模块，可以改成这个。
app.model(require('./Apps/Site/Handlers/Global').default);
app.model(require('./Apps/User/Handlers/Login').default);
app.model(require('./Apps/User/Handlers/User').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line

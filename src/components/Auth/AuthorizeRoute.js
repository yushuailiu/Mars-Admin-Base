import React, { Component, createElement, Fragment } from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from './AuthorizeRoute.less';
let routerDataCache;
let application = window.app;

const modelNotExisted = (application, model) =>
  // eslint-disable-next-line
  !application._models.some(({ namespace }) => namespace === model);
// wrapper of dynamic
const dynamicWrapper = (application, models, app, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    if (models && models.length) {
      models.forEach(model => {
        let theModel;
        if (model.indexOf('/') !== -1) {
          // eslint-disable-next-line
          theModel = require(`../../${model}`).default;
        } else {
          // eslint-disable-next-line
          theModel = require(`../../Apps/${app}/Handlers/${model}`).default;
        }
        if (modelNotExisted(application, theModel.namespace)) {
          // eslint-disable-next-line
          application.model(theModel);
        }
      });
    }
    return props => {
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
};

const formatMenuData = menu => {
  return menu.map(item => {
    const result = {
      ...item,
    };
    if (item.pages) {
      result.children = formatMenuData(item.pages);
    }
    return result;
  });
};

function loadMenu(menu) {
  if (!menu) {
    return [];
  }
  let result = [];
  menu.forEach(function(name, index) {
    let item = import(`../../Apps/${name}/config`).default;
    item.pages.forEach(function(page, index) {
      item.pages[index].app = item.app;
    });
    result.push(item);
  });
  result.sort(function(a, b) {
    return a.sort - b.sort;
  });
  return result;
}

const generateRouteData = (menu, routeData) => {
  return menu.map(item => {
    const result = {
      path: item.path,
      name: item.name,
    };
    if (!item.pages || item.pages.length === 0) {
      result.component = dynamicWrapper(application, item.handlers, item.app, () =>
        import(`../../Apps/${item.app}/Pages/${item.page}`)
      );
    }
    routeData[item.path] = result;
    if (item.pages) {
      result.children = generateRouteData(item.pages, routeData);
    }
    return result;
  });
};

@connect(state => ({
  Login: state.Login,
}))
class AuthorizeRouteComponent extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, history, location } = this.props;
    dispatch({
      type: 'Login/getCurUser',
      goLogin: function() {
        if (location.pathname != '/guest/login') {
          history.push('/guest/login');
        }
      },
      hasLogin: function() {
        if (location.pathname == '/guest/login') {
          history.push('/');
        }
      },
    });
  }

  render() {
    const {
      Login: {
        currentUser: { userInfo, menus: menus },
      },
      loading,
    } = this.props;
    if (loading) {
      return <Spin size="large" className={styles.globalSpin} />;
    }
    let menu = loadMenu(menus);
    const menuData = formatMenuData([...menu]);
    const routerData = {};
    generateRouteData(menu, routerData);
    routerDataCache = routerData;

    const render = [];
    menu.forEach(function(item, index) {
      const Component = () => import(`../../layouts/${item.layout}`);
      const Layout = props => {
        return createElement(Component().default, {
          ...props,
          routerData: routerData,
          menuData: menuData,
          currentUser: userInfo,
        });
      };
      render.push(
        <Route key={item.path} path={item.path} render={props => <Layout {...props} />} />
      );
    });
    return <Fragment>{render}</Fragment>;
  }
}

export { AuthorizeRouteComponent };

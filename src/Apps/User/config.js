/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
export default {
  sort: 2,
  layout: 'BasicLayout',
  path: '/user',
  name: '用户',
  icon: 'user',
  app: 'User',
  pages: [
    {
      path: '/user/manager',
      page: 'UserManager',
      name: '用户管理',
      handlers: ['User', 'Role'],
      icon: 'team',
    },
    {
      path: '/user/info',
      page: 'UserInfo',
      name: '我的信息',
      handler: ['User'],
      icon: 'edit',
    },
  ],
};

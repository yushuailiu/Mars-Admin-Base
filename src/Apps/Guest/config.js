/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
export default {
  sort: 2,
  layout: 'UserLayout',
  path: '/guest',
  name: '游客',
  icon: 'user',
  app: 'Guest',
  pages: [
    {
      path: '/guest/login',
      page: 'Login',
      name: '登陆',
      handlers: [],
      icon: 'user',
    },
  ],
};

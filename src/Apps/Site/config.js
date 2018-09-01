/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
export default {
  sort: 3,
  layout: 'BasicLayout',
  path: '/site',
  name: '站点设置',
  icon: 'dashboard',
  app: 'Site',
  pages: [
    {
      path: '/site/friendLink',
      page: 'FriendLink',
      name: '友情链接',
      handlers: ['FriendLink'],
      icon: 'profile',
    },
    {
      path: '/site/set',
      page: 'SiteSet',
      name: '站点配置',
      handlers: ['SiteSet'],
      icon: 'setting',
    },
  ],
};

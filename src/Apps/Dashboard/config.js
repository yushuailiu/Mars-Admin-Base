/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
export default {
  sort: 1,
  layout: 'BasicLayout',
  path: '/dashboard',
  name: 'Dashboard',
  icon: 'dashboard',
  app: 'Dashboard',
  pages: [
    {
      path: '/dashboard/statistics',
      page: 'Statistics',
      name: '统计',
      handlers: ['Statistics'],
      icon: 'area-chart',
    },
  ],
};

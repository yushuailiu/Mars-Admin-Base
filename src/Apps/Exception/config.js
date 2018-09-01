export default {
  sort: 100,
  layout: 'BasicLayout',
  path: '/exception',
  name: '异常',
  icon: 'warning',
  app: 'Exception',
  pages: [
    {
      path: '/exception/404',
      page: '404',
      name: '404',
      handlers: [],
    },
    {
      path: '/exception/500',
      page: '500',
      name: '500',
      handlers: [],
    },
  ],
};

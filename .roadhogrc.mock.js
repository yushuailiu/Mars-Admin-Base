import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /admin/api': 'http://127.0.0.1:8082/',
  'POST /admin/api': 'http://127.0.0.1:8082/',
  'PUT /admin/api': 'http://127.0.0.1:8082/',
  'DELETE /admin/api': 'http://127.0.0.1:8082/',
};

export default (noProxy ? {} : delay(proxy, 1000));

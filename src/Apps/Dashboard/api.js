/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
import request from '../../utils/request';

export default {
  async statistics() {
    return request(`/admin/api/site/statistics`);
  },
};

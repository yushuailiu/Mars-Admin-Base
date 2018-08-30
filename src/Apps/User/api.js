/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
import request from '../../utils/request';
import { stringify } from 'qs';
export default {
  async getCurUser(params) {
    return request(`/admin/api/curuser`);
  },
  async login(params) {
    return request(`/admin/api/login?${stringify(params)}`);
  },

  async logout(params) {
    return request(`/admin/api/logout`);
  },

  async updateUser(params) {
    return request(`/admin/api/user/${params.id}`, {
      method: 'PUT',
      body: params,
    });
  },

  async addUser(params) {
    return request(`/admin/api/user`, {
      method: 'POST',
      body: params,
    });
  },

  async listUser(params) {
    return request(`/admin/api/user?${stringify(params)}`);
  },

  async listRole(params) {
    return request(`/admin/api/role?${stringify(params)}`);
  },
};

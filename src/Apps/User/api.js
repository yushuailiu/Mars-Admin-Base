/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */
import { stringify } from 'qs';
import request from '../../utils/request';

export default {
  async getCurUser() {
    return request(`/admin/api/curuser`);
  },
  async login(payload) {
    return request(`/admin/api/login?${stringify(payload)}`);
  },

  async logout() {
    return request(`/admin/api/logout`);
  },

  async addUser(payload) {
    return request(`/admin/api/user`, {
      method: 'POST',
      body: payload,
    });
  },

  async listUser(payload) {
    return request(`/admin/api/user?${stringify(payload)}`);
  },

  async listRole(payload) {
    return request(`/admin/api/role?${stringify(payload)}`);
  },

  async updateUserStatus(payload) {
    return request(`/admin/api/user/status?`, {
      method: 'PUT',
      body: payload,
    });
  },

  async curUserInfo() {
    return request(`/admin/api/curuserinfo`);
  },

  async updateCurUserInfo(payload) {
    return request(`/admin/api/curuserinfo`, {
      method: 'PUT',
      body: payload,
    });
  },
};

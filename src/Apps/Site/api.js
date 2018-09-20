/**
 * Created by liushuai <admin@liuyushuai.com> on 2018/9/1.
 *
 */
import { stringify } from 'qs';
import request from '../../utils/request';

export default {
  async getSiteSet() {
    return request(`/admin/api/site/set`, {
      method: 'GET',
    });
  },

  async updateSiteSet(payload) {
    return request(`/admin/api/site/set`, {
      method: 'POST',
      body: payload,
    });
  },

  async addFriendLink(payload) {
    return request(`/admin/api/site/friendlink`, {
      method: 'POST',
      body: payload,
    });
  },

  async deleteFriendLink(payload) {
    return request(`/admin/api/site/friendlink/${payload}`, {
      method: 'DELETE',
    });
  },

  async updateFriendLink(payload) {
    return request(`/admin/api/site/friendlink/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async updateFriendLinkStatus(payload) {
    return request(`/admin/api/site/friendlink/status`, {
      method: 'POST',
      body: payload,
    });
  },

  async getFriendLink(payload) {
    return request(`/admin/api/site/friendlink?${stringify(payload)}`);
  },
};

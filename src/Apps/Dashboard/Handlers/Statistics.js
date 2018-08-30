/**
 * Created by liushuai <ln6265431@163.com> on 2018/8/27.
 *
 */

import dealResponse from '../../../utils/dealResponse';
import api from '../api';

export default {
  namespace: 'Statistics',
  state: {
    loading: false,
    data: {},
  },
  effects: {
    *statistics({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const response = yield call(api.statistics, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data,
          loading: false,
        },
      });
      dealResponse(response, success, fail);
    },
  },
  reducers: {
    save(state, action) {
      const info = {
        ...state,
        ...action.payload,
      };
      return info;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        dispatch({
          type: 'save',
          payload: {
            loading: false,
            data: {},
          },
        });
      });
    },
  },
};

/**
 * Created by liushuai <admin@liuyushuai.com> on 2018/9/1.
 *
 */
import api from '../api';
import dealResponse from '../../../utils/dealResponse';

export default {
  namespace: 'SiteSet',
  state: {
    info: {},
    loading: false,
  },

  effects: {
    *getSiteSet({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(api.getSiteSet, payload);
      yield put({
        type: 'save',
        payload: {
          info: response.data,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateSiteSet({ payload, success }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(api.updateSiteSet, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      dealResponse(response, success, undefined);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

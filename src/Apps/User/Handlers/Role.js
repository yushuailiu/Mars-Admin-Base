/**
 * Created by liushuai on 2018/2/26.
 */
import api from '../api';
// todo 如何简化
const defaultParams = {
  module: 'User',
  handler: 'Role',
};
export default {
  namespace: 'Role',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    list: [],
    loading: false,
  },

  effects: {
    *list({ payload, callback }, { select, call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(api.listRole, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};

import api from '../api';
import dealResponse from '../../../utils/dealResponse';

export default {
  namespace: 'User',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    info: {},
    loading: false,
    addLoading: false,
  },

  effects: {
    *update({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          addLoading: true,
        },
      });
      const response = yield call(api.updateUser, {
        ...payload,
      });
      yield put({
        type: 'save',
        payload: {
          addLoading: false,
        },
      });
      dealResponse(response, success, fail);
    },
    *add({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(api.addUser, {
        ...payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      dealResponse(response, success, fail);
    },
    *list({ payload, callback }, { select, call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(api.listUser, {
        ...payload,
      });
      yield put({
        type: 'save',
        payload: {
          data: response.data,
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
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};

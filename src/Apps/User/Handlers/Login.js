import api from '../api';
import dealResponse from '../../../utils/dealResponse';

export default {
  namespace: 'Login',
  state: {
    loading: false,
    currentUser: {
      userInfo: null,
      menus: [],
    },
    entryUrl: '/jjmn778l',
  },

  effects: {
    *logout({ payload, success, fail }, { select, call, put }) {
      const response = yield call(api.logout);
      // todo 没必要这样吧？
      const entryUrl = yield select(state => state.Login.entryUrl);
      window.location = entryUrl;
    },
    *login({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(api.login, {
        ...payload,
      });
      yield put({
        type: 'loading',
        payload: false,
      });
      dealResponse(response, success, fail);
    },
    *getCurUser({ success, fail, goLogin, hasLogin }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(api.getCurUser, {});
      yield put({
        type: 'loading',
        payload: false,
      });
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      if (goLogin && !response.data.userInfo) {
        goLogin();
      }
      if (hasLogin && response.data.userInfo) {
        hasLogin();
      }
    },
  },

  reducers: {
    loading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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

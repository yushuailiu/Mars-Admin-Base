/**
 * Created by liushuai on 2018/2/21.
 */
import api from '../api';
import dealResponse from '../../../utils/dealResponse';

export default {
  namespace: 'FriendLink',
  state: {
    loading: false,
    addLoading: false,
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *add({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          addLoading: true,
        },
      });
      const response = yield call(api.addFriendLink, payload);
      yield put({
        type: 'save',
        payload: {
          addLoading: false,
        },
      });
      dealResponse(response, success, fail);
    },
    *list({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const response = yield call(api.getFriendLink, payload);

      yield put({
        type: 'save',
        payload: {
          data: response.data,
          loading: false,
        },
      });
      dealResponse(response, success, fail);
    },
    *update({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const response = yield call(api.updateFriendLink, payload);
      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
      dealResponse(response, success, fail);
    },
    *delete({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const response = yield call(api.deleteFriendLink, payload);
      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
      dealResponse(response, success, fail);
    },
    *updateStatusById({ payload, success, fail }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const response = yield call(api.updateFriendLinkStatus, payload);
      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
      dealResponse(response, success, fail);
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(() => {
        dispatch({
          type: 'save',
          payload: {
            id: 0,
            loading: false,
            articleInfo: {},
          },
        });
      });
    },
  },
};

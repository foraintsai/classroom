import {queryCurrent, query as queryUsers, register} from '@/services/user';
import {message} from "antd";
import {history} from "umi";

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * fetchCurrent(_, {call, put}) {
      if (localStorage.getItem('user')) {
        // message.info(`已经存在用户了,用户信息是：${localStorage.getItem('user')}`);
        // console.log('windows:',window.location.pathname);
        if(window.location.pathname === '/'){
          history.push('/Home');
        }
        yield put({
          type: 'updateState',
          payload: {
            currentUser: JSON.parse(localStorage.getItem('user')),
          }
        })
      } else {
        history.push('/eccr/login');
      }
    },
    * register({payload}, {call, put}) {
      const data = yield call(register,payload);
      if(data){
        if(data.code === 1000){
          message.info('注册成功，您现在可以去您的邮箱查看用户名密码了。',5);
          history.push('/eccr/login');
        }else{
          message.error(data.msg);
        }
      }else{
        message.error('系统异常');
      }
    },
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload || {}};
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;

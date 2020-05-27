import {stringify} from 'querystring';
import {history} from 'umi';
import {login, fakeAccountLogin,} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';
import {message} from "antd";


const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      const data = yield call(login, payload);
      if (data.code === 1000) {
        const token = data.data.token;
        const user = data.data.user;
        const info = {token, ...user};
        localStorage.setItem('user', JSON.stringify(info));
        setAuthority(info);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        } else if (redirect == '/') {
          redirect == '/Home'
        }
        history.replace(redirect || '/Home')
      } else {
        message.error(data.msg);
      }
    },

    logout() {
      localStorage.removeItem('user');
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      return {
        ...state,
      };
    },
  },
};
export default Model;

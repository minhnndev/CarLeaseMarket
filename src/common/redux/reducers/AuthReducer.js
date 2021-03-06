import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthActionType} from '../actions/AuthAction';

const authState = {
  isLoggedIn: false,
  user: {
    identifier: '',
    expires_at: '',
    jwttoken: '',
    authorities: [],
  },
};
const getAuthState = () => {
  const auth = AsyncStorage.getItem('auth');
  try {
    const authobj = JSON.parse(auth);
    const {expires_at, jwttoken} = authobj.user;
    if (new Date(expires_at) > new Date()) {
      axios.defaults.headers.common.Authorization = `Bearer ${jwttoken}`;
      return authobj;
    }
    return authState;
  } catch (error) {
    return authState;
  }
};
const newAuth = getAuthState();
const authreducer = (state = newAuth, action) => {
  switch (action.type) {
    case AuthActionType.REGISTER_SUCCESS:
      const newAuthState = {
        isLoggedIn: true,
        user: action.payload,
      };
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload.jwt}`;
      AsyncStorage.setItem('auth', JSON.stringify(newAuthState));
      return newAuthState;

    case AuthActionType.LOGOUT_SUCCESS:
      try {
        AsyncStorage.removeItem('auth');
        delete axios.defaults.headers.common.Authorization;
        console.log('Data removed');
      } catch (error) {
        console.log(error);
      }
      return authState;

    case AuthActionType.LOGIN_SUCCESS:
      const loginAuthState = {
        isLoggedIn: true,
        user: action.payload,
      };
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload.jwt}`;
      AsyncStorage.setItem('auth', JSON.stringify(loginAuthState));
      return loginAuthState;

    default:
      return state;
  }
};

export default authreducer;

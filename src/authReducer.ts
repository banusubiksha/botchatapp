// authReducer.ts
import { LOGIN_SUCCESS, LOGOUT } from './actions';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

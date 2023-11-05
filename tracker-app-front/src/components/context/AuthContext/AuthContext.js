import axios from "axios";
import { createContext, useReducer } from "react";
import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  FETCH_PROFILE_FAIL,
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../authActionTypes";
import { API_URL_USER } from "../../utils/apiURL";

//auth context

export const AuthContext = createContext();

//initial state
const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  error: null,
  loading: false,
  profile: null,
};
//auth reducer
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //register
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        userAuth: payload,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        userAuth: null,
      };

    case LOGIN_SUCCESS:
      //add user to local storage
      localStorage.setItem("userAuth", JSON.stringify(payload));
      return {
        ...state,
        loading: false,
        error: null,
        userAuth: payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        error: payload,
        loading: false,
        userAuth: null,
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        profile: payload,
      };
    case FETCH_PROFILE_FAIL:
      return {
        ...state,
        profile: null,
        loading: false,
        error: payload,
      };
    case LOGOUT:
      //remove user from local storage
      localStorage.removeItem("userAuth");
      return {
        ...state,
        userAuth: null,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};

//provider
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // console.log(state);

  //login action
  const loginUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(` ${API_URL_USER}/login`, formData, config);
      //   if(res && res.data && res.data.status === 'success'){
      if (res?.data?.status === "success") {
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      }
      // console.log(res);
      //Redirect
      window.location.href = "/dashboard";
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error?.response?.data?.message,
      });
    }
  };

  //profile action
  const fetchProfileAction = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.userAuth?.token}`,
        },
      };
      const res = await axios.get(`${API_URL_USER}/profile`, config);
      if (res?.data) {
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload: res.data });
      }
      // console.log(res);
    } catch (error) {
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  //logout
  const logoutUserAction = () => {
    dispatch({ type: LOGOUT, payload: null });
    window.location.href = "/login";
  };

  // register user
  const registerUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        ` ${API_URL_USER}/register`,
        formData,
        config
      );
      //   if(res && res.data && res.data.status === 'success'){
      if (res?.data?.status === "success") {
        dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      }
      // console.log(res);
      //Redirect
      window.location.href = "/login";
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginUserAction,
        userAuth: state,
        token: state?.userAuth?.token,
        fetchProfileAction,
        profile: state?.profile,
        error: state?.error,
        logoutUserAction,
        registerUserAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { createContext, useReducer } from "react";
import axios from "axios";
import { API_URL_ACC } from "../../utils/apiURL";
import {
  ACCOUNT_CREATION_FAIL,
  ACCOUNT_CREATION_SUCCES,
  ACCOUNT_DETAILS_FAIL,
  ACCOUNT_DETAILS_SUCCESS,
} from "./accountActionTypes";

const accountContext = createContext();

//Initial state
const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  account: null,
  accounts: [],
  loading: false,
  error: null,
};

//Reducer
const accountReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //details
    case ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        account: payload,
      };
    case ACCOUNT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        account: null,
      };

    case ACCOUNT_CREATION_SUCCES:
      return {
        ...state,
        loading: false,
        error: null,
        account: payload,
      };
    case ACCOUNT_CREATION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        account: null,
      };

    default:
      return state;
  }
};

//provider
export const AccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, INITIAL_STATE);

  //get account details action
  const getAccountDetailsAction = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${state?.userAuth?.token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.get(`${API_URL_ACC}/${id}`, config);
      if (res?.data?.status === "success") {
        //dispatch
        dispatch({ type: ACCOUNT_DETAILS_SUCCESS, payload: res?.data?.data });
      }
      //   console.log(res);
    } catch (error) {
      dispatch({
        type: ACCOUNT_DETAILS_FAIL,
        payload: error?.data?.response?.message,
      });
    }
  };

  //create account details action
  const createAccountAction = async (formData) => {
    // console.log(state?.userAuth);
    const config = {
      headers: {
        Authorization: `Bearer ${state?.userAuth?.token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`${API_URL_ACC}`, formData, config);
      if (res?.data?.status === "success") {
        //dispatch
        dispatch({ type: ACCOUNT_CREATION_SUCCES, payload: res?.data?.data });
      }
      // console.log(res);
    } catch (error) {
      dispatch({
        type: ACCOUNT_CREATION_FAIL,
        payload: error?.data?.response?.message,
      });
    }
  };
  return (
    <accountContext.Provider
      value={{
        getAccountDetailsAction,
        account: state?.account,
        createAccountAction,
        error: state?.error,
      }}
    >
      {children}
    </accountContext.Provider>
  );
};

export default accountContext;

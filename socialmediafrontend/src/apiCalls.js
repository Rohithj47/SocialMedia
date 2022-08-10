import axios from "axios";
import { config } from "./urlConfig"

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  axios.post(`${config.SERVER_URI}/auth/login`, userCredential)
        .then((res)=>{
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data})
        })
        .catch((err) => {
          dispatch({ type: "LOGIN_FAILURE", payload: err })
        })
};


export const registerCall = async(registerCredential, dispatch)=> {
  dispatch({ type: "LOGIN_START" });
  axios.post(`${config.SERVER_URI}/auth/register`, registerCredential)
        .then((res)=>{
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data})
        })
        .catch((err) => {
          dispatch({ type: "LOGIN_FAILURE", payload: err })
        })

}
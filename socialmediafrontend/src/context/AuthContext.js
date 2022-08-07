import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer"
import { useEffect } from "react"


var user = null
const currUser = localStorage.getItem("user")
if (currUser != null){
    user = JSON.parse(currUser)
}


const INITIAL_STATE = {
    user: user,
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state])

    return(
        <AuthContext.Provider 
            value = {{ user: state.user,
                       isFetching: state.isFetching,
                       error: state.error,
                       dispatch
                    }}
            >
            {children}
        </AuthContext.Provider>

    )

}
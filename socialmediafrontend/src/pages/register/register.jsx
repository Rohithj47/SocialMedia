import { useContext, useRef } from "react";
import { registerCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";

export default function Register() {
  const email = useRef()
  const username = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const {user, isFetching, error, dispatch } = useContext(AuthContext) 
  const handleClick = (e) => {
    e.preventDefault()
    if(passwordAgain.current.value !== password.current.value){
      passwordAgain.current.setCustomValidity("Passwords dont Match!")
    }else {
      registerCall( { email: email.current.value, 
                      password: password.current.value,
                      username: username.current.value
                     }, dispatch)
    }
  }
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on socialApp.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" className="loginInput" ref= {username} />
            <input placeholder="Email" className="loginInput" ref= {email} type="email" />
            <input placeholder="Password" className="loginInput" ref= {password} type="password" />
            <input placeholder="Password Again" className="loginInput" ref={passwordAgain} type="password" />
            <button className="loginButton" type="submit">Sign Up</button>
            <button className="loginRegisterButton">
              Log into Account
            </button>
          </form>
        </div>
     </div>
    </div>
  );
}
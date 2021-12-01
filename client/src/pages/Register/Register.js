import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { signupCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import "./styles.css";

function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const navigate = useNavigate();

  const { isFetching } = useContext(AuthContext);

  const loginHandler = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Password didn't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      // signupCall(user, dispatch);
      await axios.post("/auth/register", user);
      navigate("/login");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">BeSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on BeSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              ref={username}
              required
              type="text"
              placeholder="Username"
              className="loginInput"
            />
            <input
              ref={email}
              required
              type="email"
              placeholder="Email"
              className="loginInput"
            />
            <input
              ref={password}
              required
              minLength="6"
              type="password"
              placeholder="Password"
              className="loginInput"
            />
            <input
              ref={passwordAgain}
              required
              minLength="6"
              type="password"
              placeholder="Password Again"
              className="loginInput"
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Register"
              )}
            </button>
            <span className="loginForgot">Already have Account?</span>
            <button className="loginRegisterButton" onClick={loginHandler}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

import React, { useState, useCallback } from "react";
import "../App.css";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Mainpage({ toast, signIn, user }) {
  const [users, setUsers] = useState({ userName: "", email: "", password: "" });
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const googleAuth = useCallback(() => {
    window.open(`${process.env.REACT_APP_API_URL}/google`, "_self");
  }, []);

  const openForgotPass = useCallback(() => {
    navigate("/forgotpass");
  }, [navigate]);

  const handleOnchange = useCallback((e) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleUserLogin = useCallback((e) => {
    setUserLogin(prevUserLogin => ({
      ...prevUserLogin,
      [e.target.name]: e.target.value,
    }));
  }, []);
  
  axios.defaults.withCredentials = true;
  
  const handleLogin = useCallback((e) => {
    e.preventDefault();
    if (userLogin.email === "" || userLogin.password === "") {
      toast.error("Enter the details");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, userLogin)
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          toast.success("Login successfully");
          navigate("/Home");
        } else {
          toast.error("Enter the correct details");
          setUserLogin({ email: "", password: "" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setUserLogin({ email: "", password: "" });
  }, [userLogin, toast, navigate]);

  const handleRegister = useCallback((e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/register`, users)
      .then((result) => {
        console.log(result);
        if (result.data !== "Already Registerd") {
          toast.success("Registered Successfully..");
          setUsers({ userName: "", email: "", password: "" });
          signIn();
        } else {
          toast.error(result.data);
          setUsers({ userName: "", email: "", password: "" });
          signIn();
        }
      })
      .catch((err) => console.log(err));
  }, [users, toast, signIn]);

  return (
    <>
      <div className="form-container sign-up">
        <form method="POST" action="/" onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <button type="button" onClick={googleAuth} className="icon">
              <FcGoogle size={22} />
            </button>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Username"
            id="userName"
            name="userName"
            value={users.userName}
            onChange={handleOnchange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={users.email}
            onChange={handleOnchange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={users.password}
            onChange={handleOnchange}
          />
          <button className="bt" type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form method="POST" action="/" onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <button type="button" onClick={googleAuth} className="icon">
              <FcGoogle size={22} />
            </button>
          </div>
          <span>or use your email and password</span>
          <input
            type="email"
            name="email"
            value={userLogin.email}
            onChange={handleUserLogin}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={userLogin.password}
            onChange={handleUserLogin}
            placeholder="Password"
          />
          <a onClick={openForgotPass} href="/forgotpass">
            Forget your password?
          </a>
          <button className="bt" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}

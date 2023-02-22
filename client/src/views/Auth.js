import React from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const Auth = ({ authRoute }) => {
  let body = (
    <>
      {authRoute === "login" && <LoginForm />}
      {authRoute === "register" && <RegisterForm />}
    </>
  );
  return (
    <div class="landing">
      <div class="dark-overlay">
        <div class="landing-inner">
          <h1>ToLearnList</h1>
          <h4>List course IT should learn</h4>
          {body}
        </div>
      </div>
    </div>
  );
};

export default Auth;

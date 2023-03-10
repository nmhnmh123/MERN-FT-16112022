import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link,useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useState, useContext } from "react";

const LoginForm = () => {
  //context
  const { loginUser } = useContext(AuthContext);

  //local state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  //router
  const history = useHistory();

  const { username, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const login = async (event) => {
    event.preventDefault();
    try {
      const loginData = await loginUser(loginForm);
      if(loginData.success){
        history.push('/dashboard')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form className="my-4" onSubmit={login}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            className="mb-2"
            onChange={onChangeLoginForm}
            value={username}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            className="mb-2"
            value={password}
            onChange={onChangeLoginForm}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Login
        </Button>
      </Form>
      <p>
        Don't you have an account?
        <Link to="/register">
          <Button variant="info" size="sm" className="custom-ml10">
            Register
          </Button>
        </Link>
      </p>
    </>
  );
};

export default LoginForm;

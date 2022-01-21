import { Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const history = useHistory();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = () => {
    axios
      .post(
        "/auth/login",
        {
          username: loginUsername,
          password: loginPassword,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data !== "No User Exists") {
          localStorage.setItem("user", JSON.stringify(res.data));
          history.push("/");
        } else {
          alert("Incorrect passsword or username");
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="signup-form">
      <Typography
        variant="h3"
        className="signup-form-header signup-input-field"
      >
        Sign In
      </Typography>
      <div className="username-signup-field signup-input-field">
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
      </div>
      <div className="password-signup-field signup-input-field">
        <TextField
          id="outlined-basic"
          label="Password"
          type="password"
          variant="outlined"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default LoginForm;

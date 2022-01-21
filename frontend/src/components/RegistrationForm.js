import { Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const RegistrationForm = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const handleRegister = () => {
    if (
      !registerUsername.match(/^[0-9a-z]+$/) ||
      registerUsername.length > 15
    ) {
      alert(
        "Username must be less than 15 characters and only contain alpha numeric characters"
      );
      return;
    }

    if (confirmPassword !== registerPassword) {
      alert("Passwords do not match");
      return;
    }

    if (confirmPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    axios
      .post(
        "http://localhost:4000/auth/register",
        {
          username: registerUsername,
          password: registerPassword,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data === "User Already Exists") alert("Username is in use");
        else {
          axios
            .post(
              "/auth/login",
              {
                username: registerUsername,
                password: registerPassword,
              },
              { withCredentials: true }
            )
            .then((res) => {
              if (res.data !== "No User Exists") {
                history.push("/");
              }
            })
            .catch((err) => console.log(err.message));
        }
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <div className="signup-form ">
      <Typography variant="h3" className="signup-form-header">
        Register
      </Typography>
      <div className="username-signup-field signup-input-field">
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
      </div>

      <div className="password-signup-field signup-input-field">
        <TextField
          id="outlined-basic"
          label="Password"
          type="password"
          variant="outlined"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
      </div>
      <div className="password-signup-field signup-input-field">
        <TextField
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default RegistrationForm;

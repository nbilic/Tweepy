import { useState } from "react";
import { useHistory } from "react-router";
import { LoginForm, RegistrationForm } from "../components/index";
import { Typography, Paper } from "@mui/material";
const LoginPage = () => {
  const history = useHistory();
  const [login, setLogin] = useState(true);
  if (JSON.parse(localStorage.getItem("user"))) history.push("/");
  return (
    <div className="login-page">
      <Paper elevation={10} className="signup-form-container">
        {login ? <LoginForm /> : <RegistrationForm />}
        <Typography variant="h6" className="signup-form-footer">
          {!login ? "Already have an account?" : "Don't have an account?"}
          <div onClick={() => setLogin(!login)} className="signup-button">
            {!login ? "Login" : "Register"}
          </div>
        </Typography>
      </Paper>
    </div>
  );
};

export default LoginPage;

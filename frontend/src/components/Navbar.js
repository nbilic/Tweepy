import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

// ICONS
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";

import logo from "../images/twitter-4.png";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const open = Boolean(anchorEl);
  const user = JSON.parse(localStorage.getItem("user"));
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios
      .get("/auth/logout", { withCredentials: true })
      .then(() => {
        localStorage.clear();
        history.push("/login");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="navbar-box">
      <AppBar position="static" sx={{ backgroundColor: "rgb(29,29,29)" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div className="branding">
              <img src={logo} alt="" className="logo" />

              <Link to="/" className="link-string">
                Tweepy
              </Link>
            </div>
          </Typography>

          {user ? (
            <>
              <Link to={`/profile/${user?.username}`} className="link-string">
                <Avatar src={user?.avatar} />
              </Link>
              <Typography
                variant="h6"
                component="div"
                sx={{ paddingLeft: "10px" }}
                onClick={handleClick}
                className="options-username"
              >
                {user?.username}
              </Typography>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={`/profile/${user.username}`}
                    className="link-string options"
                  >
                    <PersonIcon className="menu-icon " /> Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to={`/settings`} className="link-string options">
                    <SettingsIcon className="menu-icon" /> Settings
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToAppIcon className="menu-icon" /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link to="/login" className="link-string options">
                <LoginIcon className="menu-icon" /> Login
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;

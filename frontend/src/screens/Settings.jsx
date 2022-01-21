import { Paper, TextField, Button, Avatar } from "@mui/material";
import { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AlbumIcon from "@mui/icons-material/Album";
import Collapse from "@mui/material/Collapse";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Navbar } from "../components/index";
import axios from "axios";
const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [pwOpen, setPwOpen] = useState(false);
  const [handleOpen, setHandleOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [description, setDescription] = useState(
    user.description ? user.description : ""
  );
  const [handle, setHandle] = useState(
    user.handle ? user.handle : user.username
  );
  const [avatar, setAvatar] = useState("");

  const handleClick = () => {
    setPwOpen(!pwOpen);
  };

  const handleChangeHandle = () => {
    if (handle.match(/^[0-9a-zA-Z]+$/))
      axios
        .post(
          "http://localhost:4000/api/user/updateHandle",
          { handle: handle, id: user?._id },
          { withCredentials: true }
        )
        .then((res) => localStorage.setItem("user", JSON.stringify(res.data)))
        .catch((err) => console.log(err.message));
  };

  const handleChangePassword = () => {
    if (newPassword.length > 5) {
      if (newPassword === confirmNewPassword) {
        axios
          .post(
            "http://localhost:4000/api/user/updatePassword",
            { password: newPassword, id: user?._id },
            { withCredentials: true }
          )
          .catch((err) => console.log(err.message));
      }
    } else {
      alert("Password must be 6 or more characters long");
    }
  };

  const handleChangeDescription = () => {
    if (description.length < 200) {
      axios
        .post(
          "http://localhost:4000/api/user/updateDescription",
          { description: description, id: user?._id },
          { withCredentials: true }
        )
        .then((res) => localStorage.setItem("user", JSON.stringify(res.data)))
        .catch((err) => console.log(err.message));
    }
  };
  const handleChangeAvatar = () => {
    console.log(file);
    let formdata = new FormData();
    formdata.append("userAvatar", file);
    axios
      .post(
        `http://localhost:4000/api/user/updateAvatar/${user?._id}`,
        formdata,
        { withCredentials: true }
      )
      .then((res) => localStorage.setItem("user", JSON.stringify(res.data)))
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="options-container">
      <Navbar />
      <Paper>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Your Account
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <AlbumIcon />
            </ListItemIcon>
            <ListItemText primary={`${user?.username}`} />
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={`Change Handle`} />
            {handleOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={pwOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="change-handle-option"
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder={`@${user.username}`}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
              <Button onClick={handleChangeHandle}> Submit</Button>
            </List>
          </Collapse>
          <ListItemButton onClick={() => setDescriptionOpen(!descriptionOpen)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={`Change Description`} />
            {descriptionOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={descriptionOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="change-handle-option"
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                multiline
                placeholder={`Something about you`}
                value={description}
                sx={{ width: "300px" }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button onClick={handleChangeDescription}> Submit</Button>
            </List>
          </Collapse>
          <ListItemButton onClick={() => setHandleOpen(!handleOpen)}>
            <ListItemIcon>
              <VpnKeyIcon />
            </ListItemIcon>

            <ListItemText primary={`Change Password`} />

            {pwOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={handleOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="change-password-option "
            >
              <ListItemText primary="New Password" />
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <ListItemText primary="Confirm New Password" />
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <Button onClick={handleChangePassword}> Submit</Button>
            </List>
          </Collapse>
          <ListItemButton onClick={() => setAvatarOpen(!avatarOpen)}>
            <ListItemIcon>
              <Avatar src={avatar !== "" ? avatar : user?.avatar} />
            </ListItemIcon>
            <ListItemText primary={`Change Avatar`} />
            {avatarOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={avatarOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="change-handle-option"
            >
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />

              <Button onClick={handleChangeAvatar}> Submit</Button>
            </List>
          </Collapse>
        </List>
      </Paper>
    </div>
  );
};

export default Settings;

import {
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  Menu,
} from "@mui/material";
import axios from "axios";
import Picker from "emoji-picker-react";
import { useState, useEffect } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import useStyles from "../styles";
const CreatePost = ({ reply }) => {
  const classes = useStyles();
  const [charCounter, setCharCounter] = useState(0);
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEmojiClick = (event, emojiObject) => {
    setPostContent(`${postContent}${emojiObject.emoji}`);
    setCharCounter(postContent.length);
  };
  const charLimit = 256;
  const handleInput = (e) => {
    setPostContent(e.target.value);
    setCharCounter(e.target.value.length);
  };
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  let isMobile = width <= 600 ? true : false;
  const postForm = () => {
    if (postContent.length > 0) {
      const url = reply ? `/reply/${reply}` : "/post";

      //file.append(newTweet);
      /* let formdata = new FormData();
      formdata.append("tweetAttachment", file);
      console.log(formdata); */
      const newTweet = {
        id: user._id,
        content: postContent,
        date: new Date(),
        reply: reply ? true : false,
        parent: reply ? reply : false,
      };

      /* onst blob = file.slice(0, file.size, file.type);
      const newFile = new File([blob, "s"], "s", { type: file.type });
      console.log(newFile); */
      axios
        .post(
          `http://localhost:4000/api/tweets${url}`,
          newTweet,
          { d: "dsfdsafadfsf" },
          {
            withCredentials: true,
          }
        )
        .then(() => window.location.reload())
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <>
      <div className="create-post-container">
        <Box sx={{ flexGrow: 1 }} className="create-post-box">
          <Avatar
            src={user?.avatar}
            sx={{ marginRight: "10px", marginTop: "10px" }}
          />
          <div className="create-post-input-container">
            <TextField
              value={postContent}
              placeholder="What's happening?"
              multiline
              InputProps={{
                className: classes.input,
              }}
              sx={{ width: isMobile ? `280px` : "520px" }}
              onChange={(e) => {
                handleInput(e);
              }}
            />
            <div className="create-post-footer">
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <EmojiEmotionsIcon
                onClick={handleClick}
                style={{ marginRight: "10px", color: "yellow" }}
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <Picker onEmojiClick={onEmojiClick} />
              </Menu>
              <Typography
                variant="subtitle1"
                color={charCounter > charLimit ? "red" : "white"}
              >
                {charCounter}/{charLimit}
              </Typography>
              <Button
                disabled={charCounter > charLimit ? true : false}
                sx={{ color: "rgb(100,200,255)" }}
                onClick={postForm}
              >
                {reply ? "Reply" : "Tweet"}
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default CreatePost;

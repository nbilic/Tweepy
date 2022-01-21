// Time formatting
import TimeAgo from "react-timeago";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

// Icons
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";

import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Typography, Paper, Tooltip } from "@mui/material";

const Tweet = ({ tweet }) => {
  const formatter = buildFormatter(englishStrings);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [likes, setLikes] = useState(tweet.likes);
  const [fetching, setFetching] = useState(true);
  const [displayHidden, setDisplayHidden] = useState(false);
  const [user, setUser] = useState();
  const [liked, setLiked] = useState(
    tweet.likedBy?.includes(loggedInUser?._id) ? true : false
  );

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

  const handleLike = () => {
    axios
      .post(
        `http://localhost:4000/api/tweets/like`,
        {
          user: loggedInUser,
          id: tweet._id,
          liked: liked,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLikes(liked ? likes - 1 : likes + 1);
        setLiked(!liked);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = () => {
    axios
      .post(
        `http://localhost:4000/api/tweets/delete`,
        {
          id: tweet._id,
          parent: tweet.parent,
        },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/user/${tweet.user}`)
      .then((res) => {
        setUser(res.data);
        setFetching(false);
      })
      .catch((err) => console.log(err.message));
  }, [tweet.user]);

  if (fetching) return "";
  return (
    <div className="tweet-container">
      <Paper
        elevation={5}
        onMouseEnter={() => setDisplayHidden(true)}
        onMouseLeave={() => setDisplayHidden(false)}
        sx={{ backgroundColor: "rgb(53, 78, 100)" }}
      >
        <div className="tweet-container-wrapper">
          <div className="mobile-friendly">
            <Link to={`/profile/${user?.username}`} className="avatar-link">
              <Avatar
                src={user?.avatar}
                sx={{ marginTop: "10px" }}
                className="avatar"
              />
            </Link>
            {loggedInUser?._id === tweet?.user && isMobile && (
              <Tooltip title="Delete">
                <DeleteIcon
                  className="delete-icon-mobile tweet-action-icon"
                  onClick={handleDelete}
                />
              </Tooltip>
            )}
          </div>

          <div className="tweet-container-body">
            <div className="tweet-container-header">
              <div className="tweet-container-header-left">
                <Link to={`/profile/${user?.username}`} className="link-string">
                  <Typography
                    variant="body1"
                    className="tweet-username general-text"
                  >
                    {user?.username}{" "}
                  </Typography>
                </Link>
                <Link to={`/profile/${user?.username}`} className="link-string">
                  <Typography
                    variant="subtitle1"
                    className="tweet-handle general-text"
                  >
                    @
                    {user?.handle !== "undefined"
                      ? user?.handle
                      : user?.username}
                  </Typography>
                </Link>

                <Typography
                  variant="subtitle1"
                  className="tweet-date general-text"
                >
                  ·{" "}
                  <TimeAgo
                    date={`${new Date(tweet.date)}`}
                    formatter={formatter}
                  />
                </Typography>
              </div>
              <div>
                {loggedInUser?._id === tweet?.user &&
                  displayHidden &&
                  !isMobile && (
                    <Tooltip title="Delete">
                      <DeleteIcon
                        className="delete-icon tweet-action-icon"
                        onClick={handleDelete}
                      />
                    </Tooltip>
                  )}
              </div>
            </div>

            <p className="tweet-content general-text">{tweet?.content}</p>
            {loggedInUser && (
              <div className="tweet-container-footer">
                <div className="liked-field">
                  <Link to={`/${tweet._id}`} className="link-string">
                    <Tooltip title="Reply">
                      <ReplyIcon className="tweet-action-icon" />
                    </Tooltip>
                  </Link>
                  <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                    {tweet.repliesCount}
                  </Typography>
                </div>
                <div className="liked-field">
                  <Tooltip title="Like">
                    <FavoriteIcon
                      className={
                        liked ? "tweet-action-icon liked" : "tweet-action-icon"
                      }
                      onClick={handleLike}
                    />
                  </Tooltip>
                  <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                    {likes}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Tweet;

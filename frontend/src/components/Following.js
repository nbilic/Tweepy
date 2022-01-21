import axios from "axios";
import { useState, useEffect } from "react";
import { Avatar, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
const Following = ({ follower }) => {
  const [user, setUser] = useState();
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/user/${follower}`)
      .then((res) => {
        setUser(res.data);
        setFetching(false);
      })
      .catch((err) => console.log(err.message));
  }, [follower]);
  if (fetching) return "";
  return (
    <div className="">
      <Link to={`/profile/${user?.username}`} className="link-string">
        <Paper
          elevation={5}
          sx={{
            backgroundColor: "rgb(53, 78, 100)",
            width: "300px",
            marginBottom: "10px",
          }}
        >
          <div className="user-following-info-container">
            <Avatar
              src={user?.avatar}
              sx={{ marginLeft: "10px", marginTop: "10px" }}
            />
            <div className="user-following-info-username-handle">
              <Typography
                variant="body1"
                className="tweet-username general-text"
              >
                {user?.username}
              </Typography>
              <Typography
                variant="subtitle2"
                className="tweet-username general-text"
                sx={{ marginBottom: "20px" }}
              >
                @{user?.handle}
              </Typography>
            </div>
          </div>
        </Paper>
      </Link>
    </div>
  );
};

export default Following;

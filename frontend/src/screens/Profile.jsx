import { Avatar, Typography, Button, Modal } from "@mui/material";
import { DisplayTweets, Navbar, Following } from "../components/index";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetProfileQuery } from "../services/twitterApi";
import LinearProgress from "@mui/material/LinearProgress";
const Profile = () => {
  const { username } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [filter, setFilter] = useState("Tweets");
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const { data: user, isFetching } = useGetProfileQuery(username);

  const [following, setFollowing] = useState(
    loggedInUser?.following.includes(user?._id)
  );

  const handleClick = () => {
    axios
      .post(
        `http://localhost:4000/api/user/follow`,
        {
          follower: loggedInUser?._id,
          followed: user._id,
          follows: following,
        },
        { withCredentials: true }
      )
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setLoggedInUser(JSON.parse(localStorage.getItem("user")));
        setFollowing(res.data.follows);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    setFollowing(loggedInUser?.following.includes(user?._id));
  }, [isFetching, loggedInUser?.following, user?._id]);

  if (isFetching) return <LinearProgress />;
  if (!user) return "There seems to be nothing here";
  console.log(user);
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <Typography
          variant="h5"
          className="profile-username-display general-text"
        >
          {user?.username}
        </Typography>

        <Typography variant="subtitle2" className="tweet-handle general-text">
          {user?.tweets.length} Tweets
        </Typography>
        <Avatar
          src={user?.avatar}
          sx={{ marginTop: "5px", height: "128px", width: "128px" }}
          onClick={handleOpen}
        />
        {loggedInUser && loggedInUser._id !== user?._id && !isFetching && (
          <Button
            variant="contained"
            sx={{ marginTop: "10px" }}
            onClick={handleClick}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Typography variant="subtitle1" className="general-text">
          @{user?.handle}
        </Typography>
        <Typography variant="subtitle2" className="tweet-handle general-text">
          {user?.description}
        </Typography>
        <div className="filter-button">
          <Button onClick={() => setFilter("Tweets")}>Tweets</Button>
          <Button onClick={() => setFilter("Following")}>Following</Button>
          <Button onClick={() => setFilter("Followers")}>Followers</Button>
        </div>

        {filter === "Tweets" && <DisplayTweets profile={user} />}

        {filter === "Following" &&
          user?.following.map((follow) => <Following follower={follow} />)}

        {filter === "Followers" &&
          user?.followers.map((follow) => <Following follower={follow} />)}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="avatar-modal">
          <img src={user?.avatar} alt="avatar" className="avatar-modal-img" />
          <Button
            variant="contained"
            sx={{ marginTop: "10px" }}
            onClick={handleClose}
          >
            Close Modal
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

import {
  Navbar,
  CreatePost,
  DisplayTweets,
  TestImages,
} from "../components/index";
import { useState } from "react";
import { Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
const Homepage = () => {
  const user = useState(JSON.parse(localStorage.getItem("user")));

  const history = useHistory();

  if (!user[0]) history.push("/login");
  return (
    <>
      {user && (
        <>
          <Navbar />
          <Paper
            className="main-homepage-wrapper"
            elevation={5}
            sx={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <CreatePost />
            <DisplayTweets user={user[0]} />
          </Paper>
        </>
      )}

      {!user && <TestImages />}
    </>
  );
};

export default Homepage;

import { Tweet } from "./index";
//import { useGetTweetsQuery } from "../services/twitterApi";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { useEffect, useState } from "react";
const DisplayTweets = ({ profile, user }) => {
  const url = profile ? `/tweets/${profile._id}` : `/tweets`;
  // const { data: fetchedTweets, isFetching } = useGetTweetsQuery(`${url}`);
  const [fetchedTweets, setFetchedTweets] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api${url}`)
      .then((res) => {
        setFetchedTweets(res.data);
        setFetching(false);
      })
      .catch((err) => console.log(err.message));
  }, [url]);

  if (fetching) return <LinearProgress />;
  return (
    <div className="all-tweets">
      {fetchedTweets?.map((tweet) => (
        <Tweet tweet={tweet} key={tweet._id} />
      ))}
    </div>
  );
};

export default DisplayTweets;

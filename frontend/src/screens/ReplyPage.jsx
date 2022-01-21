import { useParams } from "react-router-dom";
import { Tweet, CreatePost, Navbar } from "../components/index";
import { useGetTweetQuery, useGetRepliesQuery } from "../services/twitterApi";
import { Paper } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
const ReplyPage = () => {
  const { id } = useParams();
  const { data: tweet } = useGetTweetQuery(id);

  const { data: replies, isFetching } = useGetRepliesQuery({
    id: id,
    count: tweet?.repliesCount,
  });
  if (isFetching) return <LinearProgress />;
  if (!replies) return "There seems to be nothing here";
  console.log(replies);
  return (
    <div>
      <Navbar />
      <div className="reply-page-container main-homepage-wrapper ">
        <Tweet tweet={tweet} />
        <Paper elevation={10}>
          <CreatePost reply={tweet?._id} />
        </Paper>
        {tweet?.repliesCount > 0 &&
          replies?.map((reply) => <Tweet key={reply._id} tweet={reply} />)}
      </div>
    </div>
  );
};

export default ReplyPage;

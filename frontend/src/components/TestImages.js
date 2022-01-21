import axios from "axios";
import { useState } from "react";
const TestImages = () => {
  const [file, setFile] = useState(null);
  const handleSubmit = () => {
    let formdata = new FormData();
    formdata.append("tweetAttachment", file);
    console.log(file);
    axios
      .post("http://localhost:4000/api/tweets/test", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err.message));
  };
  return (
    <div className="test">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TestImages;

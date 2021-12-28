import React, { useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Chart from "react-apexcharts";
import { message, Spin } from "antd";

const DashBoard = () => {
  const [hashtag, setHashtag] = useState("");
  const [sentiment, setSentiment] = useState({});
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  //function for serach by pressing enter
  const fetchData = async (e) => {
    if (e.key === "Enter") {
      if (hashtag === "") {
        message.error("Please enter a hashtag");
      } else {
        setLoading(true);
        const response = await axios.get(
          `https://twitter-sa-api.herokuapp.com/?query=${hashtag}`
        );
        console.log(response.data.Tweets);
        setTweets(response.data.Tweets.tweets);
        setSentiment(response.data.Sentiment);
        setLoading(false);
        setHashtag("");
      }
    }
  };
  //this is the options fucntion for Chart
  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: ["Positive", "Negative", "neutral"],
    },
  };
  const series = [
    {
      name: "Sentimets of Graph",
      data: [sentiment.positive, sentiment.negative, sentiment.neutral],
    },
  ];

  //if loading then the spin will be popup
  if (loading) {
    return (
      <div
        style={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#ececec",
        }}
      >
        <Spin tip="Please wait...."></Spin>
      </div>
    );
  }
  return (
    <div className="dash_board">
      <h2>Welcome to Twiter HashTag app</h2>
      <div className="main_div">
        <div className="input_comments">
          <div className="input_div">
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter HashTags"
                onChange={(e) => setHashtag(e.target.value)}
                onKeyDown={(e) => fetchData(e)}
                id="hash_tag"
              />
            </Form.Group>
          </div>
          <div className="tweets mt-3 mx-4">
            <h4>Related Tweets</h4>
            <div className="related_tweets">
              {tweets.map((data, index) => (
                <div className="tweets_handle" key={index}>
                  <img src={data.profile_image} alt="" className="image" />
                  <div>
                    <p className="user_name">{data.name}</p>
                    <p className="tweet_msg">{data.Tweet_Text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="graphs">
          {sentiment.length !== 0 ? (
            <div>
              <Chart
                options={options}
                series={series}
                type="bar"
                className="chart"
              />
              
            </div>
          ) : (
            <>
              <p>Please Enter a hash tag to see the graph</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

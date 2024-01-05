import Button from "./Button";
import JSONViewer from "./JSONViewer";
import React from "react";
import axios from "axios";
import exportData from "../utilz";
import { useState } from "react";

const SummaryPage = function (props) {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState({});
  const [summaryDateFrom, setSummaryDateFrom] = useState("");
  const [summaryDateTo, setSummaryDateTo] = useState("");
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const summaryAPIBase = "https://api.health.cloud.corsano.com/user-summaries?";

  const handleDownloadSummary = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(summary);
    exportData(
      jsonData,
      `summary_data_${summaryDateFrom}_${summaryDateTo}.json`,
      "application/json"
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSummaryLoaded(false);
    setErrorMsg("");
    const resource = `date_from=${summaryDateFrom}&date_to=${summaryDateTo}`;
    const apiURL = summaryAPIBase + resource;
    axios
      .get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const responseData = response.data;
        console.log(response);
        setSummary(responseData);
        console.log(summary);
        setSummaryLoaded(true);
      })
      .catch((error) => {
        // Handle error
        setErrorMsg(
          "Failed getting summary, please check your token and dates."
        );
        console.error(error);
      });
  };

  return (
    <div>
      <h2 className="title-text">Get Your Summary</h2>
      <form className="w-full max-w-lg text-left">
        <label className="label-text">Your token:</label>
        <input
          id="token-input"
          className="user-input"
          placeholder="Your token"
          name="token"
          type="text"
          value={token}
          onChange={(ev) => setToken(ev.target.value)}
        ></input>
        <label className="label-text">Date from: </label>
        <input
          className="user-input"
          id="date-from-picker"
          placeholder="Date from "
          name="summary-date-from"
          type="date"
          onChange={(event) => {
            const dateFromString = event.target.value;
            setSummaryDateFrom(dateFromString);
          }}
          required
        />
        <label className="label-text">Date to: </label>
        <input
          className="user-input"
          id="date-to-picker"
          placeholder="Date to"
          name="summary-date-to"
          type="date"
          onChange={(event) => {
            const dateFromString = event.target.value;
            setSummaryDateTo(dateFromString);
          }}
          required
        />
        <div>
          <Button className="grid-cols-3	" onClick={handleSubmit}>
            Download Summary
          </Button>
        </div>
      </form>
      <p className="error-text">{errorMsg}</p>

      {summaryLoaded ? (
        <div>
          <p>Summary retrieved successfully, here is the overview</p>
          <Button
            className="my-4"
            onClick={(event) => handleDownloadSummary(event)}
          >
            Download
          </Button>
          <JSONViewer name="Summary" groupLength={50} data={summary} />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default SummaryPage;

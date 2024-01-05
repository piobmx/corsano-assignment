import Button from "./Button";
import React from "react";
import axios from "axios";
import exportData from "../utilz";
import { useState } from "react";

const SummaryPage = function (props) {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState({});
  const [summaryDateFrom, setSummaryDateFrom] = useState("");
  const [summaryDateTo, setSummaryDateTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const summaryAPIBase = "https://api.health.cloud.corsano.com/user-summaries?";

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        setSummary(responseData);

        const jsonData = JSON.stringify(responseData);
        exportData(
          jsonData,
          `summary_data_${summaryDateFrom}_${summaryDateTo}.json`,
          "application/json"
        );
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
    </div>
  );
};

export default SummaryPage;

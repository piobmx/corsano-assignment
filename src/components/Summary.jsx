import Button from "./Button";
import React from "react";
import axios from "axios";
import { useState } from "react";

const SummaryPage = function (props) {
  const [token, setToken] = useState("");
  const [summaryDateFrom, setSummaryDateFrom] = useState("");
  const [summaryDateTo, setSummaryDateTo] = useState("");
  const APIRoot = "https://api.health.cloud.corsano.com/user-summaries?";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiURL =
      APIRoot + `date_from=${summaryDateFrom}&date_to=${summaryDateTo}`;
    console.log(apiURL);

    axios
      .get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Handle the token or other data if needed
      })
      .catch((error) => {
        // Handle error
        setErrorMsg(
          "Failed getting summary, please check your token and dates."
        );
      });
  };

  return (
    <div>
      <h2 className="title-text">Get Your Summary</h2>
      <p>{summaryDateFrom}</p>
      <p>{summaryDateTo}</p>
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
    </div>
  );
};

export default SummaryPage;

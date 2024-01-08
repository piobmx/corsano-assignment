import { useEffect, useState } from "react";

import Button from "./Button";
import JSONViewer from "./JSONViewer";
import React from "react";
import axios from "axios";
import exportData from "../utilz";

const SummaryPage = function (props) {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState({});
  const [summaryDateFrom, setSummaryDateFrom] = useState("");
  const [summaryDateTo, setSummaryDateTo] = useState("");
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [allowButton, setAllowButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const summaryAPIBase = "https://api.health.cloud.corsano.com/user-summaries?";

  useEffect(() => {
    const healthToken = localStorage.getItem("user-health-token");
    if (healthToken !== null) {
      setToken(healthToken);
    }
  }, []);

  useEffect(() => {
    if (summaryDateFrom !== "" && summaryDateTo !== "" && token !== "") {
      console.log(31231);
      setAllowButton(true);
    } else {
      setAllowButton(false);
    }
  }, [summaryDateFrom, summaryDateTo]);

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
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
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
          <Button
            disabled={!allowButton}
            className={allowButton ? "" : "cursor-not-allowed opacity-50"}
            onClick={handleSubmit}
          >
            Get Summary
          </Button>
        </div>
      </form>

      {allowButton ? (
        <></>
      ) : (
        <p className="label-text">You need to provide token and dates range.</p>
      )}

      {loading ? (
        <p className="label-text"> Loading Data...Please wait</p>
      ) : (
        <></>
      )}
      {errorMsg === "" ? <></> : <p className="error-text">{errorMsg}</p>}

      {summaryLoaded ? (
        <div>
          <p className="label-text">
            Summary retrieved successfully, here is the overview
          </p>
          <Button
            className="download-button"
            onClick={(event) => handleDownloadSummary(event)}
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            Download
          </Button>
          <div>
            <JSONViewer name="Summary" groupLength={50} data={summary} />
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default SummaryPage;

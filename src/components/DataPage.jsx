import { useEffect, useState } from "react";

import Button from "./Button";
import JSONViewer from "./JSONViewer";
import React from "react";
import axios from "axios";
import exportData from "../utilz";
import { json } from "react-router-dom";

const buttonsData = [
  { label: "Activities", action: "activity" },
  { label: "RR-Intervals", action: "rr-interval" },
  { label: "Sleep", action: "sleep" },
  { label: "Temperature", action: "temperature" },
  { label: "Heart rate", action: "heart-rate-variability" },
];

const DataPage = function (props) {
  const [token, setToken] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userRawData, setUserRawData] = useState([]);
  const [currentMetricType, setCurrentMetricType] = useState("");
  const [allowButton, setAllowButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const APIBase = "https://api.health.cloud.corsano.com";

  useEffect(() => {
    const healthToken = localStorage.getItem("user-health-token");
    if (healthToken !== null) {
      setToken(healthToken);
    }
  }, []);

  useEffect(() => {
    if (dateFrom !== "" && (dateTo !== "") & (token !== "")) {
      setAllowButton(true);
    } else {
      setAllowButton(false);
    }
  }, [dateFrom, dateTo]);

  const convertDateToAbsolute = (dateString) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj)) {
        throw new Error("Invalid date string");
      }

      const absoluteDate = dateObj.toISOString().slice(0, -1); // remove last "Z" based on the doc
      return absoluteDate;
    } catch (error) {
      console.error("Error converting date:", error.message);
      return "";
    }
  };

  const handleDownloadData = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(userRawData);
    exportData(
      jsonData,
      `${currentMetricType}_data_${dateFrom}_${dateTo}.json`,
      "application/json"
    );
  };

  const handleButtonClick = (event, metricType) => {
    event.preventDefault();
    setLoading(true);
    setDataLoaded(false);
    setCurrentMetricType(metricType);

    const resource = `/v2/raw-metrics/${metricType}?from_client_date=${dateFrom}&to_client_date=${dateTo}`;
    const apiUrl = APIBase + resource;

    console.log(apiUrl);

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setUserRawData(data);
        const jsonData = JSON.stringify(data);
        setDataLoaded(true);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        setErrorMsg(
          "Data retrieval not successful, please check the token and the time interval (start to end) is correct"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2 className="title-text">Get Your Data</h2>
      <form className="w-full max-w-lg text-left">
        <label className="label-text">
          Please enter your health cloud token:{" "}
        </label>
        <input
          className="user-input"
          id="token-input"
          placeholder="Your token"
          name="token"
          type="text"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        ></input>
        <label className="label-text">Date from: </label>
        <input
          className="user-input"
          id="date-from-picker"
          placeholder="Date from "
          name="date-from"
          type="datetime-local"
          onChange={(ev) => {
            const dateFromString = ev.target.value;
            const absoluteDateFrom = convertDateToAbsolute(dateFromString);
            setDateFrom(absoluteDateFrom);
          }}
          required
        ></input>
        <label className="label-text ">Date to: </label>
        <input
          id="date-to-picker"
          placeholder="Date to"
          className="user-input"
          name="date-to"
          type="datetime-local"
          onChange={(ev) => {
            const dateToString = ev.target.value;
            const absoluteDateTo = convertDateToAbsolute(dateToString);
            setDateTo(absoluteDateTo);
          }}
          required
        ></input>
        <label className="label-text ">Choose metric:</label>
        <div>
          {buttonsData.map((button, index) => (
            <Button
              key={index}
              disabled={!allowButton}
              className={
                allowButton ? "" : " mt-1 cursor-not-allowed opacity-50"
              }
              onClick={(event) => handleButtonClick(event, button.action)}
            >
              {button.label}
            </Button>
          ))}
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
      {dataLoaded ? (
        <div>
          <p className="label-text">
            Data retrieved successfully, there are {userRawData.length} results
            in total, here is the overview
          </p>
          <Button
            className="download-button"
            onClick={(event) => handleDownloadData(event)}
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
            <JSONViewer
              name={currentMetricType}
              groupLength={50}
              data={userRawData}
            />
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default DataPage;

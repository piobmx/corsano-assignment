import Button from "./Button";
import JSONViewer from "./JSONViewer";
import React from "react";
import axios from "axios";
import exportData from "../utilz";
import { json } from "react-router-dom";
import { useState } from "react";

const DataPage = function (props) {
  const [token, setToken] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userRawData, setUserRawData] = useState([]);
  const [currentMetricType, setCurrentMetricType] = useState("");
  const APIBase = "https://api.health.cloud.corsano.com";

  const convertDateToAbsolute = (dateString) => {
    const dateObj = new Date(dateString);
    const absoluteDate = dateObj.toISOString().slice(0, -1); // remove last "Z" based on the doc
    return absoluteDate;
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
        setErrorMsg("Data retrieval not successful, please check the token.");
      });
  };

  return (
    <div>
      <h2 className="title-text">Get Your Data</h2>
      <form className="w-full max-w-lg text-left">
        <label className="label-text">Please enter your token: </label>
        <input
          className="user-input"
          id="token-input"
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
          name="date-from"
          type="datetime-local"
          onChange={(ev) => {
            const dateFromString = ev.target.value;
            const absoluteDateFrom = convertDateToAbsolute(dateFromString);
            setDateFrom(absoluteDateFrom);
          }}
          required
        ></input>
        <label className="label-text">Date to: </label>
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
        <label className="label-text">Choose metric:</label>
        <div>
          <Button onClick={(event) => handleButtonClick(event, "activity")}>
            Activities
          </Button>
          <Button onClick={(event) => handleButtonClick(event, "rr-interval")}>
            rr retrieval
          </Button>
          <Button onClick={(event) => handleButtonClick(event, "sleep")}>
            Sleep
          </Button>
          <Button onClick={(event) => handleButtonClick(event, "temperature")}>
            Temperature
          </Button>
          <Button
            onClick={(event) =>
              handleButtonClick(event, "heart-rate-variability")
            }
          >
            Heart rate
          </Button>
        </div>
      </form>
      <p className="error-text">{errorMsg}</p>
      {dataLoaded ? (
        <div>
          <p>
            Data retrieved successfully, there are {userRawData.length} results
            in total, here is the overview
          </p>
          <Button
            className="my-4"
            onClick={(event) => handleDownloadData(event)}
          >
            Download
          </Button>
          <div >
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

import Button from "./Button";
import React from "react";
import axios from "axios";
import { useState } from "react";

const exportData = (data, fileName, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

const DataPage = function (props) {
  const [token, setToken] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userRawData, setUserRawData] = useState();
  const APIRoot = "https://api.health.cloud.corsano.com";

  const convertDateToAbsolute = (dateString) => {
    const dateObj = new Date(dateString);
    const absoluteDate = dateObj.toISOString().slice(0, -1); // remove last "Z" based on the doc
    return absoluteDate;
  };

  const handleButtonClick = (event, metricType) => {
    event.preventDefault();
    const resource = `/v2/raw-metrics/${metricType}?from_date=${dateFrom}?to_date=${dateTo}`;
    const apiUrl = APIRoot + resource;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { data } = response;
        setUserRawData(data);
        console.log(response);
        const jsonData = JSON.stringify(data);
        exportData(jsonData, `${metricType}_data.json`, "application/json");
      })
      .catch((error) => {
        // Handle error
        setErrorMsg("Data retrieval not successful, please check the token.");
      });
  };

  return (
    <div>
      <h2 className="title-text">Get Your Data</h2>
      <p>{dateFrom}</p>
      <p>{dateTo}</p>
      <form
        className="w-full max-w-lg text-left"
        onSubmit={() => {
          console.log("formfe");
        }}
      >
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
        </div>
        <br />
      </form>

      <p>{errorMsg}</p>
    </div>
  );
};

export default DataPage;
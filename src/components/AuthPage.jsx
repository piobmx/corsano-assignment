import { useRef, useState } from "react";

import Button from "./Button";
import React from "react";
import axios from "axios";

const AuthPage = function (props) {
  const [loginState, setLoginState] = useState(false);
  const [userCredential, setUserCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState("");
  const [healthToken, setHealthToken] = useState("");
  const [copyUserTokenSuccess, setCopyUserTokenSuccess] = useState(false);
  const [copyHealthTokenSuccess, setCopyHealthTokenSuccess] = useState(false);
  const [healthTokenSuccess, setHealthTokenSuccess] = useState(false);
  const baseLoginURL = "https://api.users.cloud.corsano.com/login";
  const baseHealthURL = "https://api.health.cloud.corsano.com/login";

  const handleCopyClick = (tokenType) => {
    try {
      if (tokenType === "health") {
        navigator.clipboard.writeText(healthToken);
        setCopyHealthTokenSuccess(true);
      }
      if (tokenType === "user") {
        navigator.clipboard.writeText(token);
        setCopyUserTokenSuccess(true);
      }
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
      if (tokenType === "health") {
        setCopyHealthTokenSuccess(false);
      }
      if (tokenType === "user") {
        setCopyUserTokenSuccess(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoginState(false);
    setHealthTokenSuccess(false);
    setErrorMsg("");
    setCopyUserTokenSuccess(false);
    setCopyHealthTokenSuccess(false);
    axios
      .post(
        baseLoginURL,
        {
          email: userCredential,
          password: password,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          },
          proxy: {
            protocol: "https",
            host: "127.0.0.1",
          },
        }
      )
      .then((response) => {
        // Handle the token
        const responseData = response.data;
        const token = responseData.token;
        setToken(token);
        setLoginState(true);
      })
      .catch((error) => {
        // Handle error
        setErrorMsg(
          "Login failed, please check your username or password and try again."
        );
        console.error("Authentication failed, error:", error);
      });
  };

  const handleHealthToken = async (event) => {
    event.preventDefault();
    setHealthTokenSuccess(false);
    axios
      .post(
        baseHealthURL,
        {
          user_api_token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Handle the token
        console.log(response);
        const responseData = response.data;
        const token = responseData.token;
        setHealthToken(token);
        setHealthTokenSuccess(true);
      })
      .catch((error) => {
        // Handle error
        setErrorMsg(
          "Getting health token failed, please check your username or password and try again."
        );
        console.error("Authentication failed, error:", error);
      });
  };
  return (
    <div>
      <h2 className="title-text">User Authentication</h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <label className="label-text">Your login: </label>
        <input
          className="user-input"
          placeholder="Your login"
          id="login-input"
          name="login"
          type="text"
          value={userCredential}
          onChange={(ev) => setUserCredential(ev.target.value)}
        ></input>
        <label className="label-text">Your password: </label>
        <input
          id="password"
          name="password"
          className="user-input"
          type="password"
          placeholder="*******"
          autoComplete="on"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        ></input>
        <Button>Get Token</Button>
        <br />
      </form>
      <div className="w-full max-w-lg">
        {loginState ? (
          <div>
            <br />
            <label className="label-text">Your token:</label>
            <input
              className="user-input border-gray-300 disabled:bg-blue-gray-50 disabled:border-2 border-2"
              id="token-field"
              name="token"
              type="text"
              placeholder="Token"
              value={token}
              disabled={true}
            />
            <Button
              onClick={() => handleCopyClick("user")}
              className="bg-green-500 "
            >
              {copyUserTokenSuccess ? "Copy Successful!" : "Copy Token"}
            </Button>
            <Button onClick={handleHealthToken} className="bg-green-500">
              Get Health Token
            </Button>
            {healthTokenSuccess ? (
              <div>
                <label className="label-text">Your Health Token:j</label>
                <input
                  className="user-input border-gray-300 disabled:bg-blue-gray-50 disabled:border-2 border-2"
                  id="health-token-field"
                  name="health-token"
                  type="text"
                  value={healthToken}
                  disabled={true}
                />
                <Button
                  onClick={() => handleCopyClick("health")}
                  className="bg-green-500 "
                >
                  {copyHealthTokenSuccess
                    ? "Copy Successful!"
                    : "Copy Health Token"}
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <p className="text-red-500	">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

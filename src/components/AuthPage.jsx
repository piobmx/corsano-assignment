import { useEffect, useRef, useState } from "react";

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
  const [userTokenLoading, setUserTokenLoading] = useState(false);
  const [healthTokenLoading, setHealthTokenLoading] = useState(false);
  const [healthTokenSuccess, setHealthTokenSuccess] = useState(false);
  const baseLoginURL = "https://api.users.cloud.corsano.com/login";
  const baseHealthURL = "https://api.health.cloud.corsano.com/login";

  useEffect(() => {
    localStorage.setItem("user-health-token", healthToken);
  }, [healthToken]);

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

  const handleSubmit1 = async (event) => {
    event.preventDefault();

    setUserTokenLoading(true);
    setHealthTokenLoading(true);
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
            "Content-Type": "application/json",
          },
        }
      )
      .then((userCloudResponse) => {
        const responseData = userCloudResponse.data;
        const token = responseData.token;
        setToken(token);
        setLoginState(true);
        return axios.post(
          baseHealthURL,
          {
            user_api_token: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      })
      .then((healthCloudResponse) => {
        // Handle the token
        console.log(healthCloudResponse);
        const responseData = healthCloudResponse.data;
        const token = responseData.token;
        setHealthToken(token);
        setHealthTokenSuccess(true);
      })
      .catch((error) => {
        setErrorMsg(
          "Login failed, please check your username or password and try again."
        );
        console.error("Authentication failed, error:", error);
      })
      .finally(() => {
        setUserTokenLoading(false);
        setHealthTokenLoading(false);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUserTokenLoading(true);
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
            "Content-Type": "application/json",
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
      })
      .finally(() => {
        setUserTokenLoading(false);
      });
  };

  const handleHealthToken = async (event) => {
    event.preventDefault();
    setHealthTokenLoading(true);
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
      })
      .finally(() => {
        setHealthTokenLoading(false);
      });
  };
  return (
    <div>
      <h2 className="title-text">User Authentication</h2>

      <form className="w-full max-w-lg" onSubmit={handleSubmit1}>
        <label className="label-text">Your login: </label>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              className="user-input"
              placeholder="Your login"
              id="login-input"
              name="login"
              type="text"
              value={userCredential}
              onChange={(ev) => setUserCredential(ev.target.value)}
            />
          </div>
        </div>

        <label className="label-text mt-2">Your password: </label>
        <input
          id="password"
          name="password"
          className="user-input mt-1"
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
        {userTokenLoading ? (
          <p className="label-text"> Loading...Please wait</p>
        ) : (
          <></>
        )}
        {loginState ? (
          <div className="mt-3">
            <label className="label-text">Your Users Cloud token:</label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <input
                  className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id="token-field"
                  name="token"
                  type="text"
                  placeholder="Token"
                  value={token}
                  onChange={(ev) => setToken(ev.target.value)}
                  disabled={false}
                />
              </div>
              <button
                onClick={() => handleCopyClick("user")}
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {copyUserTokenSuccess ? "Copy Successful!" : "Copy Token"}
              </button>
            </div>

            {/* <Button onClick={handleHealthToken} className="bg-green-500">
              Get Health Token
            </Button> */}

            {healthTokenSuccess ? (
              <>
                <label className="label-text">Your Health Cloud Token:</label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                      className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id="health-token-field"
                      name="health-token"
                      type="text"
                      value={healthToken}
                      disabled={true}
                    />
                  </div>
                  <button
                    onClick={() => handleCopyClick("health")}
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {copyUserTokenSuccess ? "Copy Successful!" : "Copy Token"}
                  </button>
                </div>
              </>
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

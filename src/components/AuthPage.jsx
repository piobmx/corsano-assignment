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
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    try {
      navigator.clipboard.writeText(token);
      setCopySuccess(true);
    } catch (err) {
      // console.error("Unable to copy text to clipboard", err);
      setCopySuccess(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const d = new Date();
    setCopySuccess(false);
    setLoginState(false);
    setErrorMsg("");

    // setToken(d.toString());
    // setLoginState(true);

    axios
      .post(
        "https://api.users.cloud.corsano.com/login",
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
        // Handle the token or other data if needed
        const { token } = response.data;
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

  return (
    <div className="top-component">
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
            <Button onClick={handleCopyClick} className="bg-green-500 ">
              {copySuccess ? "Copy Successful!" : "Copy Token"}
            </Button>
          </div>
        ) : (
          <p className="text-red-500	">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

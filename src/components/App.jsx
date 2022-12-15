import React, { useState, useEffect } from "react";
import WebPlayback from "./WebPlayback";
import Login from "./Login";
// import './App.css';

function App() {
  const [token, setToken] = useState("");

  //send a get request to the /auth/token endpoint to check if we have a
  //valid access token already requested
  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token); //set token once received
    }

    getToken();
  }, []);

  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}

export default App;

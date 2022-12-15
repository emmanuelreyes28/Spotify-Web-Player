const express = require("express");
const dotenv = require("dotenv");
const request = require("request");

const port = 5000;

dotenv.config();

let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const app = express();

let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

//request user authorization by getting an Authorization code
app.get("/auth/login", (req, res) => {
  //scope is a space seperated list of actions that our app can be allowed to do on a user's behalf
  let scope = "streaming user-read-email user-read-private";

  //state is a randomly generated string to protect against attacks such as cross-site request forgery
  let state = generateRandomString(16);

  let auth_query_parameters = new URLSearchParams({
    response_type: "code", //code will be exchanged for an access token
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

//request the access token using the Authorization code requested in the previous step
app.get("/auth/callback", (req, res) => {
  let code = req.query.code;

  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code, //authorization code returned on previous step
      //must exactly match the same value sent on the user authorization request. This value is used for validation only since there is no actual redirection
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: "authorization_code", //must always contain the value "authorization_code"
    },
    headers: {
      //a base64 encoded string that contains the client ID and client secret keys
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded", //inform the server about the encoding of the body
    },
    json: true,
  };

  request.post(authOptions, function (error, reponse, body) {
    if (!error && reponse.statusCode === 200) {
      let access_token = body.access_token; //access token stored locally
      res.redirect("/"); //redirected to root route
    }
  });
});

//return access token
//this access token will be used to instantiate the Web Playback SDK and eventually perform API calls using the Web API
app.get("/auth/token", (req, res) => {});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

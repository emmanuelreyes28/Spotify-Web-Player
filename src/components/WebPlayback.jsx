import React, { useState, useEffect } from "react";

function WebPlayback(props) {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    //to install SDK is to load the library a new script tag within the dom tree
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    //create player once Web Playback SDK has been successfully loaded
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(props.token); //pass in token received using props
        },
        volume: 0.5,
      });

      setPlayer(player);

      //implement listeners supported by the SDK

      //emitted when the SDK is connected and ready to stream content
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      //in case the connection is broken
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="main-wrapper"></div>
      </div>
    </>
  );
}

export default WebPlayback;

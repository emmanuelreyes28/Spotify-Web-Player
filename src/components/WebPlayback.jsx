import React, { useState, useEffect } from "react";

const track = {
  name: "",
  album: {
    images: [
      {url: ""}
    ]
  },
  artists: [
    {name: ""}
  ]
}

function WebPlayback(props) {
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false); //indicates whether current track is being played or not
  const [is_active, setActive] = useState(false); //indicates whetther the current playback has been transferred to this player or not
  const [current_track, setTrack] = useState(track); //object stores the current playing track 

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

      player.addListener('player_state_changed', (state => {
        if(!state){
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then(state => {
          (!state) ? setActive(false) : setActive(true)
        });
      }));

      player.connect();
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          <img src={current_track.album.images[0].url} className="now-playing__cover" alt="album cover"/>
          <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>
            <div className="now-playing__artist">{current_track.artists[0].name}</div>

            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                &lt;&lt;
            </button>

            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                { is_paused ? "PLAY" : "PAUSE" }
            </button>

            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                &gt;&gt;
            </button>
        </div>      
        </div>
      </div>
    </>
  );
}

export default WebPlayback;

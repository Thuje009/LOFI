import { React, useState } from "react";
import "./styles.scss";
import CloseIcon from "@mui/icons-material/Close";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Draggable from "react-draggable";
import Tooltip from "@mui/material/Tooltip";

function LinkYoutube() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoID, setVideoID] = useState("");
  const [isOpenLink, setIsOpenLink] = useState(false);
  const [hidelink, setHideLink] = useState(true);
  const [hideicons, setIcons] = useState(false);

  const playVideo = () => {
    const id = extractVideoID(youtubeLink);
    if (id) {
      setVideoID(id);
    } else {
      alert("Invalid YouTube link!");
    }
  };

  const extractVideoID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      playVideo();
      setIcons(true);
      setHideLink(false);
           
    }
  };

  const clickOpen = () => {
    setIsOpenLink(true);
  };

  return (
    <div>
      <Tooltip title="Youtube" placement="right-start">
        <YouTubeIcon
          onClick={clickOpen}
          sx={{ fontSize: "35px", color: "#fff", padding: "0" }}
        />
      </Tooltip>
      {isOpenLink && (
        <Draggable handle=".head">
          <div className="App">
            <div
              className="head"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "5px",
                background: "#BB98FF",
                borderRadius: "10px 10px 0px 0px",
                cursor: "move",
              }}
            >
              <div className="head-container">
                {hidelink && (
                  <input
                    type="text"
                    id="youtubeLink"
                    placeholder="Paste URL Youtube"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                )}
                {hideicons && (
                  <YoutubeSearchedForIcon
                    style={{ color: "#fff" }}
                    onClick={() => {
                      setHideLink(true);
                      setIcons(false);
                    }}
                  />
                )}
              </div>
              <CloseIcon
                style={{ color: "#fff", cursor: "pointer" }}
                onClick={()=>{setIsOpenLink(false);}}
              />
            </div>

            {videoID && (
              <div className="video-container">
                <iframe
                  title="YouTube Video"
                  src={`https://www.youtube.com/embed/${videoID}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default LinkYoutube;
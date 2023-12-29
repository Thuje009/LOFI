import Demo from "../audioplayer/Demo";
import "./Home.scss";
import Header from "../../layout/header/head";
import { Romantic, chil, Sad, happy, sexy } from "../../data/songData";
import Sidebar from "../../layout/sideBar/sidebar";
import { useState, useEffect } from "react";
import { useMode } from "../../context/modeContext";
import AtmosphereButton from "../atmosphereIcons/atmosphere";
import { typeLofi } from "../../data/chooseVideo";

const Home = () => {
  const [currentVideoOpacity, setCurrentVideoOpacity] = useState(1);
  const [nextVideoOpacity, setNextVideoOpacity] = useState(0);
  const [nextPath, setNextPath] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [isNextPath, setIsNextPath] = useState(false);

  const { mode } = useMode();
  const [selectedMode, setSelectedMode] = useState(chil);
  const { dayNight, atmosphere, changedImage } = useMode();
  const mergeMode = (dayNight || "day") + "-" + atmosphere;

  console.log(mergeMode);

  const handleVideoPaths = (imageData) => {
    if (Array.isArray(imageData?.data)) {
      imageData.data.forEach((pathLofi) => {
        if (pathLofi.mode === dayNight || pathLofi.mode === mergeMode) {
          switch (pathLofi.mode) {
            case "day":
              if (mergeMode !== `${dayNight}-rain`) {
                setNextVideoOpacity(0);
                setCurrentVideoOpacity(1);
                setCurrentPath(pathLofi.src);
              }
              break;
            case "night":
              if (mergeMode !== `${dayNight}-rain`) {
                setNextVideoOpacity(1);
                setCurrentVideoOpacity(0);
                setNextPath(pathLofi.src);
              }
              break;
            case "day-rain":
              if (currentPath) {
                setNextVideoOpacity(1);
                setCurrentVideoOpacity(0);
                setNextPath(pathLofi.src);
                console.log("next day-rain");
              } else {
                setNextVideoOpacity(0);
                setCurrentVideoOpacity(1);
                setCurrentPath(pathLofi.src);
                console.log("current day-rain");
              }
              break;
            case "night-rain":
              if (nextPath) {
                setNextVideoOpacity(0);
                setCurrentVideoOpacity(1);
                setCurrentPath(pathLofi.src);
                console.log("current night-rain");
              } else {
                setNextVideoOpacity(1);
                setCurrentVideoOpacity(0);
                setNextPath(pathLofi.src);
                console.log("next night-rain");
              }
              break;
            default:
              break;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (mode === "chill") {
      setSelectedMode(chil);
    } else if (mode === "romantic") {
      setSelectedMode(Romantic);
    } else if (mode === "sad") {
      setSelectedMode(Sad);
    } else if (mode === "sexy") {
      setSelectedMode(sexy);
    } else if (mode === "happy") {
      setSelectedMode(happy);
    } else {
      setSelectedMode(chil);
    }
  }, [mode]);

  useEffect(() => {
    if (changedImage && changedImage.name) {
      if (changedImage.name === "lofi1" && changedImage.data) {
        handleVideoPaths(changedImage);
        // console.log(
        //   "lofi1",
        //   changedImage.data.find((item) => item.mode === dayNight)?.src || ""
        // );
      } else if (changedImage.name === "lofi2" && changedImage.data) {
        handleVideoPaths(changedImage);
        // console.log(
        //   "lofi2",
        //   changedImage.data.find((item) => item.mode === dayNight)?.src || ""
        // );
      } else if (changedImage.name === "lofi3" && changedImage.data) {
        handleVideoPaths(changedImage);
        // console.log(
        //   "lofi3",
        //   changedImage.data.find((item) => item.mode === dayNight)?.src || ""
        // );
      }
    }

    if (nextPath) {
      setIsNextPath(true);
    }
  }, [dayNight, atmosphere, changedImage?.data]);

  return (
    <div className="main">
      <div className="fh relative">
        <Header />
        <div
          className="background-video video-player"
          style={{ opacity: currentVideoOpacity }}
        >
          <video className="videofirst" src={currentPath} autoPlay loop muted />
        </div>

        <div
          className="background-video video-player"
          style={{ opacity: nextVideoOpacity }}
        >
          <video className="videosecond" src={nextPath} autoPlay loop muted />
        </div>

        <div>
          <Sidebar />
        </div>

        <div className="btn-rain">
          <AtmosphereButton />
        </div>
      </div>
      <span className="audioplayer">
        <Demo mode={selectedMode} />
      </span>

      <div className="modeName">
        <p>Mode - {selectedMode[0].mode}</p>
      </div>
    </div>
  );
};

export default Home;

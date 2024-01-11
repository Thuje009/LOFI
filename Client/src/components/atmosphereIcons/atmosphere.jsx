// atmosphereButton.jsx

import React, { useEffect, useState, useRef } from "react";
import Slider from "@mui/material/Slider";
import { useMode } from "../../context/modeContext";
import { useAtmosphereContext } from "../../context/atmosphere";
import { sound } from "../../data/atmosphere";
import "./style.scss";

const AtmosphereButton = ({ name }) => {
  const { atmosphere, setAtmosphere } = useMode();
  const {
    volumes,
    handleSliderChange,
    isPlaying,
    toggleIsPlaying,
    setVolumes,
  } = useAtmosphereContext();
  const [isSlideVisible, setIsSlideVisible] = useState(false);
  const [soundPath, setSoundPath] = useState();

  useEffect(() => {
    const foundSound = sound.find((a) => a.name === name);
    // console.log(foundSound);

    if (foundSound) {
      setSoundPath(foundSound);
    }
  }, [name]);

  // console.log(soundPath);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (soundPath) {
      audioRef.current.src = soundPath.pathSound;
      audioRef.current.volume = volumes[soundPath.id] / 100;

      const playAudio = () => {
        audioRef.current.play().catch((error) => {
          // console.error("Error playing audio:", error);
        });
      };

      const pauseAudio = () => {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
        }
      };

      if (isPlaying[soundPath.id]) {
        playAudio();
      } else {
        pauseAudio();
        audioRef.current.currentTime = 0;
      }

      return () => {
        pauseAudio();
        audioRef.current.currentTime = 0;
        audioRef.current.removeEventListener("ended", pauseAudio);
      };
    }
  }, [isPlaying, volumes, soundPath]);

  const handleToggle = () => {
    // console.log("Handle Toggle Clicked");
    const newVolumes = [...volumes];
    newVolumes[soundPath.id] = 30; // Set the volume to 0 in the local state
    setVolumes(newVolumes); // Update the context with the new volumes

    toggleIsPlaying(soundPath.id);
    if (name === "rain") {
      setAtmosphere(atmosphere === "rain" ? "" : "rain");
    }
    if (atmosphere === "rain") {
      setIsSlideVisible(false);
    } else {
      setIsSlideVisible(true);
      setTimeout(() => {
        setIsSlideVisible(false);
      }, 15000);
    }
    // console.log(isPlaying[3])
  };

  const handleSliderChangeWithCheck = (id, newValue, name) => {
    if (name === "rain") {
      if (newValue === 0) {
        setAtmosphere("");
      } else {
        setAtmosphere(name);
      }
    }

    handleSliderChange(id, newValue, name);
  };

  return (
    <div className="side-volume">
      {soundPath && (
        <div className={`button-rain ${atmosphere}`} onClick={handleToggle}>
          <div>
            <audio src={soundPath.pathSound} loop />
          </div>
          <img src={soundPath.pathImg} alt="" />
        </div>
      )}

      <div className={`slide ${isSlideVisible ? "display-block" : ""}`}>
        {soundPath && (
          <Slider
            value={volumes[soundPath.id]}
            onChange={(e, newValue) =>
              handleSliderChangeWithCheck(
                soundPath.id,
                newValue,
                soundPath.name
              )
            }
            aria-labelledby="continuous-slider"
            sx={{
              color: "#FFF",
              marginLeft: "10px",
              marginRight: "10px",
              width: "100px",
            }}
            className="rage-volume"
          />
        )}
      </div>
    </div>
  );
};

export default AtmosphereButton;

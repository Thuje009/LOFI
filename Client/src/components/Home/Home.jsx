// Home.jsx
import Demo from "../audioplayer/Demo";
import "./Home.scss";
import Header from "../../layout/header/head";
import {
  Romantic,
  chil,
  Sad,
  happy,
  sexy,
  pathLofi1,
} from "../../data/songData";
import Sidebar from "../../layout/sideBar/sidebar";
import { useState, useEffect } from "react";
import { useMode } from "../../layout/catagory/modeContext";

function Home() {
  const { mode } = useMode(); // Destructure `mode` instead of `cat`
  const [selectedMode, setSelectedMode] = useState(chil);
  const {dayNight} = useMode()

  // console.log(selectedMode[0].mode)

  useEffect(() => {
    // console.log("Mode changed:", mode);
    if (mode === "chill") {
      setSelectedMode(chil);
    } else if (mode === "romantic") {
      setSelectedMode(Romantic);
    } else if (mode === "sad") {
      setSelectedMode(Sad);
    } else if (mode === "sexy") {
      setSelectedMode(sexy);
    } else if (mode === "Happy") {
      setSelectedMode(happy);
    } else {
      setSelectedMode(chil);
    }
  }, [mode]);

  // console.log(mode);

  return (
    <div className="main">
      <Header />
      <div>
        <Sidebar />
      </div>
      <span className="audioplayer">
        <Demo mode={selectedMode} />
      </span>
      {dayNight === "day" ? <video src={pathLofi1[0].src} autoPlay loop muted /> : (dayNight === "night" ? <video src={pathLofi1[1].src} autoPlay loop muted /> : <></>)}
      
    </div>
  );
}

export default Home;

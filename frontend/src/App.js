import "./Stylesheets/App.css";
import Bottombar from "./Components/Bottombar/Bottombar";
import SidbarLeft from "./Components/SibebarLeft/SidebarLeft";
import Mainview from "./Components/Main/Mainview";
import React, { useRef } from "react";
import { Slide, Box } from "@mui/material";
import { useState } from "react";
import { SongContextProvider } from "./Hooks/SongProvider";

function App() {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const divRef = useRef();

  const handleError = (error) => {
    setTimeout(() => setChecked(false), 1900);
    setTimeout(() => setError(""), 2100);
    if (!checked) {
      setError(error);
      setChecked(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <main className="main-view" ref={divRef}>
        <div className="error-box-holder">
          <Box className="error-container">
            <Slide direction="down" in={checked} container={divRef.current}>
              <Box
                color={"error"}
                sx={{ color: "black", backgroundColor: "white" }}
                className="error-box"
              >
                {error}
              </Box>
            </Slide>
          </Box>
        </div>
        <div className="grid-container">
          <SongContextProvider>
            <SidbarLeft className="sidebar-left" />
            <Mainview
              className="mainview"
              handleError={(e) => handleError(e)}
              error={error}
              checked={checked}
            />
            <Bottombar
              className="bottom-bar"
              handleError={(e) => handleError(e)}
            />
          </SongContextProvider>
        </div>
      </main>
    </div>
  );
}

export default App;

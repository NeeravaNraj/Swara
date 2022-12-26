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
  const [showAp, setShowAp] = useState(true);

  const divRef = useRef();

  const handleError = (error) => {
    setTimeout(() => setChecked(false), 1900);
    setTimeout(() => setError(""), 2100);
    if (!checked) {
      setError(error);
      setChecked(true);
    }
  };

  const handleCollapse = () => {
    setShowAp((prev) => !prev);
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
        <div
          className="grid-container"
          style={{
            gridAutoRows: showAp ? "90vh" : "100vh",
            transition: "0.4s ease",
          }}
        >
          <SongContextProvider>
            <SidbarLeft
              className="sidebar-left"
              handleCollapse={handleCollapse}
              showAp={showAp}
            />
            <Mainview
              handleError={(e) => handleError(e)}
              error={error}
              checked={checked}
              showAp={showAp}
            />
            <Bottombar
              className="bottom-bar"
              handleError={(e) => handleError(e)}
              handleCollapse={handleCollapse}
              showAp={showAp}
            />
          </SongContextProvider>
        </div>
      </main>
    </div>
  );
}

export default App;

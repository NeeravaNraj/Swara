import React, { useState } from "react";
import { Modal, Box, Slide } from "@mui/material";
import "../../../Stylesheets/Settings.css";
import SettingsSidebar from "./SettingsSidebar";
import SettingsMain from "./SettingsMain";
import { useSongContext } from "../../../Hooks/SongProvider";

function SettingsWindow({ open, close, handleError, checked, error }) {
  const [settingsView, setSettingsView] = useState({ view_name: "type" });
  const { setSearchFocused } = useSongContext();

  const handleClose = () => {
    close(false);
    setSearchFocused(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className="flex-reset">
      <>
        <Box className="error-container">
          <Slide direction="down" in={checked} mountOnEnter unmountOnExit>
            <Box
              color={"error"}
              sx={{ color: "black", backgroundColor: "white" }}
              className="error-box"
            >
              {error}
            </Box>
          </Slide>
        </Box>
        <div className="settings-window-container">
          <SettingsSidebar
            view={settingsView}
            setView={(v) => setSettingsView(v)}
          />
          <SettingsMain
            view={settingsView}
            handleError={(v) => handleError(v)}
          />
        </div>
      </>
    </Modal>
  );
}

export default SettingsWindow;

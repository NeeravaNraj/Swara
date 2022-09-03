import React, { useState } from "react";
import { Modal } from "@mui/material";
import "../../../Stylesheets/Settings.css";
import SettingsSidebar from "./SettingsSidebar";
import SettingsMain from "./SettingsMain";

function SettingsWindow({ open, close, handleError}) {
  const [settingsView, setSettingsView] = useState({view_name: 'type'});

  return (
    <Modal open={open} onClose={() => close(false)} className="flex-reset">
      <div className="settings-window-container">
        <SettingsSidebar view={settingsView} setView={(v) => setSettingsView(v)}/>
        <SettingsMain view={settingsView} handleError={(v) => handleError(v)}/>
      </div>
    </Modal>
  );
}

export default SettingsWindow;

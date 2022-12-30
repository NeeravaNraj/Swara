import React from "react";

function SettingsSidebar({ view, setView }) {
  const handleViewChange = (viewName) => {
    setView({ view_name: viewName });
  };

  return (
    <div className="settings-sidebar">
      <div className="settings-options-container">
        <button
          className={
            view.view_name === "type"
              ? "sidebar-option sidebar-option-clicked"
              : "sidebar-option"
          }
          onClick={() => handleViewChange("type")}
        >
          Song types
        </button>
        <button
          className={
            view.view_name === "raga"
              ? "sidebar-option sidebar-option-clicked"
              : "sidebar-option"
          }
          onClick={() => handleViewChange("raga")}
        >
          Raga
        </button>
        <button
          className={
            view.view_name === "composer"
              ? "sidebar-option sidebar-option-clicked"
              : "sidebar-option"
          }
          onClick={() => handleViewChange("composer")}
        >
          Composers
        </button>
        <button
          className={
            view.view_name === "lyricist"
              ? "sidebar-option sidebar-option-clicked"
              : "sidebar-option"
          }
          onClick={() => handleViewChange("lyricist")}
        >
          Tala
        </button>
        <button
          className={
            view.view_name === "tuner"
              ? "sidebar-option sidebar-option-clicked"
              : "sidebar-option"
          }
          onClick={() => handleViewChange("tuner")}
        >
          Tuners
        </button>
      </div>
    </div>
  );
}

export default SettingsSidebar;

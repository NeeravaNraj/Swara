import { useState } from "react";
import "../../Stylesheets/Bottombar.css";
import AudioPlayer from "./AudioPlayer";

function Bottombar({ handleError, showAp, handleCollapse }) {
  return (
    <>
      <div
        className="bottombar"
        style={{
          opacity: showAp ? "1" : "0",
          transform: showAp ? "" : "translateY(10em)",
          transition: "0.4s ease",
        }}
      >
        <AudioPlayer
          handleError={(e) => handleError(e)}
          handleCollapse={handleCollapse}
          showAp={showAp}
        />
      </div>
    </>
  );
}

export default Bottombar;

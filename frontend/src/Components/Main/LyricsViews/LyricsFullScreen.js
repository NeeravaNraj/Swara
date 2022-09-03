import React from "react";
import { IoMdClose } from "react-icons/io";

function LyricsFullScreen({ lyrics, handleClose }) {
  return (
    <div className="fullscreen-container">
      <div className="fullscreen-lyrics-top-container">
        <h2 className="lyrics-title">Lyrics</h2>
        <button className="fullscreen-lyrics-close-btn">
          <IoMdClose
            className="fullscreen-lyrics-close-btn-icon"
            onClick={handleClose}
          />
        </button>
      </div>
      {lyrics === "undefined" ? (
        <h2 className="fullscreen-lyrics-text">No lyrics for this song</h2>
      ) : (
        <h2 className="fullscreen-lyrics-text">{lyrics}</h2>
      )}
    </div>
  );
}

export default LyricsFullScreen;

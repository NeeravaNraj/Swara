import React, { useState } from "react";
import { Modal } from "@mui/material";
import "../../../Stylesheets/Details.css";

function Details({ values, open, close }) {
  const { composer, lyricist, tuned_by, raga, lyrics, song_name, song_type } =
    values;
  return (
    <Modal open={open} onClose={() => close(false)} className="flex-reset">
      <div className="details-box">
        <h2 className="content name">{song_name}</h2>
        <p className="descriptor">Raga</p>
        <h3 className="content raga-details">{raga}</h3>
        <p className="descriptor">Song type</p>
        <h4 className="content type-text">{song_type}</h4>
        {composer !== "unknown" && (
          <>
            <p className="descriptor">Composer</p>
            <h4 className="content complyrtun">{composer}</h4>
          </>
        )}
        {lyricist !== "unknown" && (
          <>
            <p className="descriptor">Lyricist</p>
            <h4 className="content complyrtun">{lyricist}</h4>
          </>
        )}
        {tuned_by !== "unknown" && (
          <>
            <p className="descriptor">Tuner</p>
            <h4 className="content complyrtun">{tuned_by}</h4>
          </>
        )}
        {lyrics !== "undefined" && (
          <>
            <p className="descriptor">Lyrics</p>
            <h4 className="content lyrics">{lyrics}</h4>
          </>
        )}
      </div>
    </Modal>
  );
}

export default Details;

import React, { useEffect, useState } from "react";
import { Box, Slide } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { BsFullscreen, BsArrowsCollapse } from "react-icons/bs";

function Lyrics({ lyrics, setShowLyrics, handleFullScreen }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [lyricsWidth, setLyricsWidth] = useState({width: '100%'})

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  };

  const handleClose = () => {
    setShowLyrics(false);
  };

  useEffect(() => {
    if (!isCollapsed){
      setTimeout(() => setLyricsWidth({width:'0%'}), 1000)
    }if(isCollapsed){
      setLyricsWidth({width:'30%'})
    }
  },[isCollapsed])

  useEffect(() => {
    setIsCollapsed(true)
  }, [lyrics])


  return (
    <div className="all-lyrics-container" style={lyricsWidth}>
      <div className="lyrics-container">
        {!isCollapsed && (
          <Box className="lyrics-control-collapsed">
            <IoMdClose
              className="lyrics-controls lyrics-close-btn"
              onClick={handleClose}
            />
            <BsArrowsCollapse
              className="lyrics-controls lyrics-generic-btn collapse"
              onClick={handleCollapse}
            />
            <BsFullscreen
              className="lyrics-controls lyrics-generic-btn"
              onClick={handleFullScreen}
            />
          </Box>
        )}
        <Box className="lyrics-box-container">
          <Slide direction="left" in={isCollapsed}>
            <Box className="lyrics-box">
              <Box className="lyrics-control">
                <IoMdClose
                  className="lyrics-controls lyrics-close-btn"
                  onClick={handleClose}
                />
                <BsArrowsCollapse
                  className="lyrics-controls lyrics-generic-btn collapse"
                  onClick={handleCollapse}
                />
                <BsFullscreen
                  className="lyrics-controls lyrics-generic-btn"
                  onClick={handleFullScreen}
                />
              </Box>

              {lyrics === "undefined" ? (
                <h4 className="lyrics-text undefined">
                  No lyrics for this song
                </h4>
              ) : (
                <h4 className="lyrics-text">{lyrics}</h4>
              )}
            </Box>
          </Slide>
        </Box>
      </div>
    </div>
  );
}

export default Lyrics;

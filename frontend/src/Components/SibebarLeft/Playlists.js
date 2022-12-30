import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAllPlaylists, useViews, useUrl } from "../../Hooks/SongProvider";
import { Menu, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import AreYouSure from "../AreYouSure";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Playlists(props) {
  const [textColor, setTextColor] = useState("rgb(193, 193, 193)");
  const [contextMenu, setContextMenu] = useState(null);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [areYouSureContent, setAreYouSureContent] = useState(null);

  const { allPlaylists, setAllPlaylists } = useAllPlaylists();
  const { currentView, setCurrView } = useViews();
  const URL = useUrl();

  const handleDelete = async () => {
    const filteredData = allPlaylists.filter((playlist) => {
      if (playlist.playlist_id !== props.id) {
        return playlist;
      }
    });
    setAllPlaylists(filteredData);
    props.handleSelect(0);
    if (props.id === currentView.playlist_id) {
      setCurrView({ name: "Songs", playlist_id: 0, view_name: "playlist" });
    }
    await axios.delete(`${URL}/api/playlist/` + props.id);
  };

  const handlePlaylistSelect = () => {
    if (contextMenu === null) {
      props.handleSelect(props.id);
      setCurrView({
        name: props.name,
        playlist_id: props.id,
        view_name: "playlist",
      });
    } else if (contextMenu !== null) {
      setContextMenu(null);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
    setTextColor("rgb(193, 193, 193)");
  };

  const handleShowEditForm = () => {
    props.handleEdit({ pl_id: props.id, pl_name: props.name });
  };

  const handleAreYouSure = (method) => {
    setShowAreYouSure(true);
    setAreYouSureContent({ name: props.name, method: method });
  };

  const handleGoAhead = (method) => {
    if (method === "delete") {
      handleDelete();
    }
  };

  return (
    <>
      {showAreYouSure && (
        <AreYouSure
          open={showAreYouSure}
          close={(v) => setShowAreYouSure(v)}
          values={areYouSureContent}
          handleGoAhead={(v) => handleGoAhead(v)}
        />
      )}
      <div
        className="playlist-btn"
        onMouseEnter={() => {
          setTextColor("white");
        }}
        onClick={handlePlaylistSelect}
        onContextMenu={(e) => handleContextMenu(e)}
        onMouseLeave={() => {
          setTextColor("rgb(193, 193, 193)");
        }}
      >
        <button
          key={props.id}
          className={
            currentView.playlist_id === props.id ? "btn sidebar-clicked" : "btn"
          }
          id="playlist-btn"
        >
          {props.name}
        </button>
        <ThemeProvider theme={darkTheme}>
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            transitionDuration={100}
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleShowEditForm}>Edit playlist</MenuItem>
            <MenuItem onClick={() => handleAreYouSure("delete")}>
              Delete playlist
            </MenuItem>
          </Menu>
        </ThemeProvider>
      </div>
    </>
  );
}

export default Playlists;

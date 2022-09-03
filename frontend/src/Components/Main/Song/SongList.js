import React from "react";
import "../../../Stylesheets/songlist.css";
import { FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { TbMicrophone2 } from "react-icons/tb";
import {
  UpdateCurrSong,
  useIsPlayingContext,
  useCurrentSong,
  useSongContext,
  useViews,
  useNumberOfSongs,
  useAllPlaylists,
  useUrl
} from "../../../Hooks/SongProvider";
import axios from "axios";
import { Menu, MenuItem, createTheme, ThemeProvider } from "@mui/material";
import { NestedMenuItem } from "mui-nested-menu";
import AreYouSure from "../../AreYouSure";
import PlaylistItem from "./PlaylistItem";
import FileDownloader from "./FileDownloader";

function SongList(props) {
  const [isPlaying, setPlaying] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [areYouSureContent, setAreYouSureContent] = useState(null);
  const [download, setDownload] = useState(false);
  const [url, setUrl] = useState(null);
  const open = Boolean(anchorElement);

  const currentSong = useCurrentSong();
  const updateSong = UpdateCurrSong();
  const { currIsPlaying, updateIsPlaying, setSongname, setProvIndex } =
    useIsPlayingContext();
  const { data, updateData } = useSongContext();
  const { currentView } = useViews();
  const { updateNumOfSongs } = useNumberOfSongs();
  const { allPlaylists } = useAllPlaylists();
  const URL = useUrl()

  useEffect(() => {
    if (currentSong !== props.id) {
      setPlaying(false);
    }
    if (currentSong === props.id) {
      setSongname({ name: props.song_name, type: props.song_type });
    }
  }, [currentSong]);

  useEffect(() => {
    if (props.id === currentSong) {
      if (currIsPlaying === false && isPlaying === true) {
        setPlaying(false);
        setSongname({ name: props.song_name, type: props.song_type });
      }
      if (currIsPlaying === true && isPlaying === false) {
        setPlaying(true);
      }
    }
  }, [currIsPlaying]);

  const handleUpdate = () => {
    updateSong(props.id);
    setProvIndex(props.index);
    updateIsPlaying(!currIsPlaying);
    if (typeof window !== undefined) {
      localStorage.setItem("urlId", props.id);
    }
  };

  const handleDeleteSong = async () => {
    const filteredData = data.filter((song) => {
      if (song.song_id !== props.id) {
        return song;
      }
    });
    updateData(filteredData);
    await axios.delete(`${URL}/api/songs/` + props.id);
    updateNumOfSongs((prev) => prev - 1);
  };

  const handleAreYouSure = (method) => {
    setAreYouSureContent({ name: props.song_name, method: method });
    setShowAreYouSure(true);
    setAnchorElement(null);
    setContextMenu(null);
  };

  const handleGoAhead = (method) => {
    if (method === "delete") {
      handleDeleteSong();
    }
    if (method === "remove") {
      handleRemoveSong();
    }
  };

  const handleRemoveSong = async () => {
    const filterData = data.filter((song) => {
      if (song.song_id !== props.id) {
        return song;
      }
    });
    updateData(filterData);
    await axios.delete(
      `${URL}/api/song-playlist/song/` + props.id
    );
    updateNumOfSongs((prev) => prev - 1);
  };

  const handleMenu = (e) => {
    e.preventDefault();
    setAnchorElement(e.currentTarget);
    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 }
        : null
    );
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
    setContextMenu(null);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleEdit = () => {
    props.editSong(props);
    setAnchorElement(null);
    setContextMenu(null);
  };

  const handleDetails = () => {
    props.songDetails(props);
    setAnchorElement(null);
    setContextMenu(null);
  };

  const handleDownload = () => {
    setDownload(true);
    setUrl(`${URL}/download/song/${props.id}`);
  };

  const handleAddToPlaylist = (id) => {
    const data = { song_id: props.id, playlist_id: id };
    axios
      .post(`${URL}/api/song-playlist`, data, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((resp) => {
        if (resp.data.content) {
          updateData((prev) => [...prev, resp.data.content[0]]);
        }
        if (resp.data.err) {
          props.handleError(resp.data.err);
        }
      });
    setAnchorElement(null);
    setContextMenu(null);
  };

  const handleLyricShow = () => {
    props.handleLyrics(props.lyrics);
    setAnchorElement(null);
    setContextMenu(null);
  };

  const handleStopDownload = () => {
    setDownload(false);
    setUrl(null);
  };

  return (
    <>
      {download && (
        <FileDownloader fileUrl={url} handleStop={handleStopDownload} />
      )}
      <div className="song-container" onContextMenu={(e) => handleMenu(e)}>
        {showAreYouSure && (
          <AreYouSure
            open={showAreYouSure}
            close={(v) => setShowAreYouSure(v)}
            values={areYouSureContent}
            handleGoAhead={(v) => handleGoAhead(v)}
          />
        )}
        <button className="play-btn" onClick={handleUpdate}>
          {isPlaying ? (
            <FaPause className="playpause-icon" />
          ) : (
            <FaPlay className="playpause-icon" />
          )}
        </button>
        <div className="image-container">
          <FaMusic />
        </div>
        <div className="meta-container">
          <h2
            className="song-name"
            style={
               props.id === currentSong
                  ? { color: "#FF7517" }
                  : { color: "white" }
            }
          >
            {props.song_name}
          </h2>
          <a className="artist">{props.song_type}</a>
        </div>

        <div className="raga">
          <h4 className="raga-text">{props.raga}</h4>
        </div>

        <div className="song-details">
          <button className="heart-btn lyrics-btn" onClick={handleLyricShow}>
            <TbMicrophone2 className="heart" />
          </button>
          <p className="duration-list">{props.duration}</p>
          <div className="details-dropdown">
            <HiDotsHorizontal
              className="details"
              onClick={(e) => handleMenu(e)}
              id="details-button"
              aria-controls={open ? "dropdown" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            />
            {
              <ThemeProvider theme={darkTheme}>
                <Menu
                  open={contextMenu !== null}
                  anchorEl={anchorElement}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    contextMenu !== null
                      ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                      : undefined
                  }
                  id="dropdown"
                  MenuListProps={{ "aria-labelledby": "detials-button" }}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  transitionDuration={100}
                >
                  <MenuItem onClick={handleDetails}>Details</MenuItem>
                  <MenuItem onClick={handleLyricShow}>Lyrics</MenuItem>
                  <MenuItem onClick={handleEdit}>Edit song</MenuItem>
                  <NestedMenuItem label="Add to playlist" parentMenuOpen={open}>
                    <div></div>
                    {allPlaylists.map((playlist) => {
                      return (
                        <PlaylistItem
                          key={playlist.playlist_id}
                          id={playlist.playlist_id}
                          name={playlist.playlist_name}
                          handleClick={(id) => handleAddToPlaylist(id)}
                        />
                      );
                    })}
                  </NestedMenuItem>
                  <MenuItem onClick={handleDownload}>Download</MenuItem>
                  {currentView.playlist_id === 0 ||
                  currentView.view_name === "search" ? (
                    <MenuItem onClick={() => handleAreYouSure("delete")}>
                      Delete Song
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => handleAreYouSure("remove")}>
                      Remove from this playlist
                    </MenuItem>
                  )}
                </Menu>
              </ThemeProvider>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default SongList;

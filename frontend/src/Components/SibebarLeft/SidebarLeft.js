import "../../Stylesheets/SidebarLeft.css";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { GoSearch } from "react-icons/go";
import { BsPlusSquare } from "react-icons/bs";
import { FaMusic } from "react-icons/fa";
import { BiCog, BiInfoCircle } from "react-icons/bi";
import {
  useFormShowContext,
  useShowPlaylistForm,
  useAllPlaylists,
  useViews,
  useSongContext,
  useNumberOfSongs,
  useUrl,
  useIsPlayingContext,
} from "../../Hooks/SongProvider";
import { IoIosArrowDown } from "react-icons/io";
import { Box, Slide } from "@mui/material";
import { nanoid } from "nanoid";
import Playlists from "./Playlists";
import axios from "axios";
import EditPlaylist from "./EditPlaylist";
import SettingsWindow from "./SettingsComponents/SettingsWindow";
import About from "./About/About";

function SidbarLeft({ handleCollapse, showAp }) {
  const { setShow } = useFormShowContext();
  const { setShowPlaylist } = useShowPlaylistForm();
  const { allPlaylists, setAllPlaylists } = useAllPlaylists();
  const { currentView, setCurrView } = useViews();
  const { updateData, setSearchFocused } = useSongContext();
  const { updateNumOfSongs } = useNumberOfSongs();
  const URL = useUrl();

  const [showEditPlaylist, setShowEditPlaylist] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    playlists();
  }, [allPlaylists]);

  const handleSelect = (playlistId) => {
    axios.get(`${URL}/api/playlist/${playlistId}`).then((resp) => {
      updateData(resp.data.content.songs);
      updateNumOfSongs(resp.data.content.numOfSongs);
    });
  };

  const playlists = () => {
    const mappedPlaylists = allPlaylists.map((playlist) => (
      <Playlists
        key={nanoid(5)}
        name={playlist.playlist_name}
        id={playlist.playlist_id}
        allPlaylists={allPlaylists}
        setAllPlaylists={setAllPlaylists}
        handleSelect={(input) => handleSelect(input)}
        handleEdit={(v) => handleEdit(v)}
      />
    ));
    return mappedPlaylists;
  };

  const handleFormOpen = () => {
    setShow(true);
    setSearchFocused(true);
  };

  const handlePlaylistFormOpen = () => {
    setShowPlaylist(true);
    setSearchFocused(true);
  };

  const handleSelectAll = (type) => {
    if (type === "songs") {
      if (currentView.name === "Songs") return;
      handleSelect(0);
      setCurrView({ name: "Songs", playlist_id: 0, view_name: "playlist" });
    }
    if (type === "home") {
      if (currentView.name === "Home") return;
      setCurrView({ name: "Home", playlist_id: null, view_name: "home" });
    }
    if (type === "search") {
      if (currentView.name === "Search") return;
      setCurrView({ name: "Search", playlist_id: null, view_name: "search" });
    }
  };

  const handleEdit = (v) => {
    setEditPlaylistId(v);
    setShowEditPlaylist(true);
    setSearchFocused(true);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setSearchFocused(true);
  };
  const handleError = (error) => {
    setTimeout(() => setChecked(false), 1900);
    setTimeout(() => setError(""), 2100);
    setError(error);
    setChecked(true);
  };
  return (
    <>
      <div className="sidebar-left">
        {showEditPlaylist && (
          <EditPlaylist
            open={showEditPlaylist}
            close={(v) => setShowEditPlaylist(v)}
            values={editPlaylistId}
          />
        )}

        {showSettings && (
          <SettingsWindow
            open={showSettings}
            close={(v) => setShowSettings(v)}
            handleError={(v) => handleError(v)}
            checked={checked}
            error={error}
          />
        )}
        <About open={showAbout} close={(v) => setShowAbout(v)} />
        <div className="sidebar-container">
          <div className="links-container">
            <button className="btn" onClick={() => handleSelectAll("home")}>
              <AiOutlineHome className="icon" /> Home
            </button>
            <button className="btn" onClick={() => handleSelectAll("search")}>
              <GoSearch className="icon" /> Search
            </button>
            <button className="btn" onClick={() => handleSelectAll("songs")}>
              <FaMusic /> All Songs
            </button>
            <div className="add-items-container">
              <button className="btn addbtn" onClick={handleFormOpen}>
                <BsPlusSquare className="icon addsong" /> Add Song
              </button>
              <button className="btn addbtn" onClick={handlePlaylistFormOpen}>
                <BsPlusSquare className="icon addsong" /> Create playlist
              </button>
            </div>
          </div>
          <div className="playlist-container">
            <h3 className="playlist-title">PLAYLISTS</h3>
            <div className="playlist-scroll">{playlists()}</div>
          </div>
        </div>
        <div className="settings-container">
          <button className="btn" onClick={handleShowSettings}>
            <BiCog className="icon cog" /> Settings
          </button>
          <button className="btn" onClick={() => setShowAbout(true)}>
            <BiInfoCircle className="icon cog" /> About
          </button>
          {!showAp && (
            <button className="btn" onClick={handleCollapse}>
              <IoIosArrowDown
                className="icon cog"
                style={{
                  transform: "rotate(-180deg)",
                }}
              />
              Show player
            </button>
          )}
        </div>
      </div>
    </>
  );
}
export default SidbarLeft;

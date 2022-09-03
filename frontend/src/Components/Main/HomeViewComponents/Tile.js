import React from "react";
import { FaMusic } from "react-icons/fa";
import "../../../Stylesheets/HomeView.css";
import {
  useViews,
  useSongContext,
  useNumberOfSongs,
  useUrl
} from "../../../Hooks/SongProvider";
import axios from "axios";

function Tile({ title, playlist_id }) {
  const { setCurrView } = useViews();
  const { updateData } = useSongContext();
  const { updateNumOfSongs } = useNumberOfSongs();
  const URL = useUrl()

  const handleClick = () => {
    setCurrView({
      name: title,
      playlist_id: playlist_id,
      view_name: "playlist",
    });
    axios
      .get(`${URL}/api/playlist/` + String(playlist_id))
      .then((resp) => {
        updateData(resp.data.content.songs);
        updateNumOfSongs(resp.data.content.numOfSongs);
      });
  };

  return (
    <div className="tile" onClick={handleClick}>
      <div className="tile-img">
        <FaMusic className="music-icon-tile" />
      </div>
      <div className="tile-inner">
        <h2 className="tile-title">{title}</h2>
        <p className="describer">Playlist</p>
      </div>
    </div>
  );
}

export default Tile;

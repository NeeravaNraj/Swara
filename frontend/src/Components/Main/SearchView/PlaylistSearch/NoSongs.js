import axios from "axios";
import React, { useState, useEffect } from "react";
import { GoSearch } from "react-icons/go";
import { FaMusic } from "react-icons/fa";
import {
  useSongContext,
  useViews,
  useNumberOfSongs,
  useUrl
} from "../../../../Hooks/SongProvider";

function NoSongs({ page }) {
  const [searchItem, setSearchItem] = useState("");
  const [tempSongs, setTempSongs] = useState([]);
  const { updateData } = useSongContext();
  const { currentView } = useViews();
  const { updateNumOfSongs } = useNumberOfSongs();
  const URL = useUrl()

  useEffect(() => {
    if (tempSongs.length === 0) {
      setTempSongsAxios();
    }
  }, [searchItem]);

  const setTempSongsAxios = () => {
    axios
      .get(`${URL}/api/search?query=${searchItem}&page=${page}`)
      .then((resp) => setTempSongs(resp.data.content.results));
  };

  const handleOnChange = (e) => {
    setSearchItem(e.target.value);
    setTempSongsAxios();
  };

  const handleAdd = (id) => {
    const data = { song_id: id, playlist_id: currentView.playlist_id };
    axios
      .post(`${URL}/api/song-playlist`, data, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((resp) => updateData((prev) => [...prev, resp.data.content[0]]));
    const filteredTemp = tempSongs.filter((song) => {
      if (song.song_id !== id) {
        return song;
      }
    });
    setTempSongs(filteredTemp);
    updateNumOfSongs(prev => prev + 1)
  };

  return (
    <>
      <div className="nosong-container">
        <h3 className="nosongs-title">Add some songs to this playlist</h3>
        <div className="nosongs-searchbox">
          <GoSearch className="nosongs-mag" />
          <input
            placeholder={"Search"}
            className="nosongs-search"
            onChange={(e) => handleOnChange(e)}
          ></input>
        </div>
      </div>
      {searchItem && (
        <div className="song-list-container">
          {tempSongs.map((v, i) => {
            return (
              <div className="song-container" key={i}>
                <div className="image-container">
                  <FaMusic />
                </div>
                <div className="meta-container">
                  <h2 className="song-name">{v.song_name}</h2>
                  <a className="artist">{v.song_type}</a>
                </div>
                <div className="raga">
                  <h4 className="raga-text">{v.song_raga}</h4>
                </div>
                <div className="song-details">
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(v.song_id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default NoSongs;

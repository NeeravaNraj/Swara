import "../../Stylesheets/Mainview.css";
import AddSongForm from "./Forms/SongForm/AddSongForm";
import React from "react";
import { useState, useEffect } from "react";
import SongList from "./Song/SongList";
import {
  useSongContext,
  useFormShowContext,
  useShowPlaylistForm,
  useViews,
  useMaxPages,
  useNumberOfSongs,
  useUrl,
} from "../../Hooks/SongProvider";
import AddPlaylistForm from "./Forms/PlaylistForm/AddPlaylistForm";
import NoSongs from "./SearchView/PlaylistSearch/NoSongs";
import HomeView from "./HomeViewComponents/HomeView";
import useScrollPercentage from "./useScrollPercentage";
import axios from "axios";
import Search from "./SearchView/SongSearch/Search";
import EditForm from "./Forms/SongForm/EditForm";
import Details from "./Song/Details";
import { Slide, Box, Switch, FormControlLabel } from "@mui/material";
import Lyrics from "./LyricsViews/Lyrics";
import LyricsFullScreen from "./LyricsViews/LyricsFullScreen";

function Mainview() {
  const { data, updateData } = useSongContext();
  const { showForm } = useFormShowContext();
  const { showPlaylistForm } = useShowPlaylistForm();
  const { currentView, setCurrView } = useViews();
  const { maxPages, updateMaxPages } = useMaxPages();
  const { numOfSongs } = useNumberOfSongs();
  const URL = useUrl();
  
  const [songsList, setSongsList] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [prevView, setPrevView] = useState("");
  const [page, setPage] = useState(1);
  const [maxReached, setMaxReached] = useState(false);
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showEditSong, setEditSong] = useState(false);
  const [editItems, setEditItems] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [checked, setChecked] = useState(false);
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState(null);
  const [showLyricsFullscreen, setShowLyricsFullscreen] = useState(false);

  const [scrollRef, scrollPercentage] = useScrollPercentage();

  const calculateTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const returnedHours = hours > 0 ? `${hours}` : null;
    const minutes = Math.floor(secs / 60);
    const returnedMinute = minutes >= 10 ? `${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const returnedHourMinutes = Math.floor((secs / 3600 - hours) * 60);

    if (returnedHours !== null)
      return `${returnedHours}:${
        returnedHourMinutes >= 10
          ? returnedHourMinutes
          : `0${returnedHourMinutes}`
      }:${returnedSeconds}`;
    else return `${returnedMinute}:${returnedSeconds}`;
  };

  useEffect(() => {
    if (currentView.playlist_id !== null) {
      listedSongs();
    }
  }, [data]);

  useEffect(() => {
    setPrevView(currentView);
  }, [songsList]);

  useEffect(() => {
    if (numOfSongs === 0) {
      setSelecting(true);
    } else if (
      numOfSongs > 0 &&
      prevView.playlist_id !== currentView.playlist_id
    ) {
      setSelecting(false);
    }
  }, [currentView, numOfSongs]);

  useEffect(() => {
    if (page === maxPages) {
      setMaxReached(true);
    }
  }, [page]);

  useEffect(() => {
    if (scrollPercentage >= 70 && scrollPercentage < 80) {
      if (currentView.view_name === "search") {
        if (!maxReached) {
          setPage((prev) => prev + 1);
          axios
            .get(
              `${URL}/api/search?query=${searchQuery}&field=${field}&page=${
                page + 1
              }`
            )
            .then((resp) =>
              updateData((prev) => prev.concat(resp.data.content.results))
            );
        }
      }
      if (data.length < numOfSongs) {
        if (
          currentView.view_name === "playlist" &&
          currentView.playlist_id === 0
        ) {
          if (!maxReached) {
            setPage((prev) => prev + 1);
            axios
              .get(
                `${URL}/api/playlist/${currentView?.playlist_id}?page=${
                  page + 1
                }`
              )
              .then((resp) =>
                setSongsList((prev) =>
                  prev.concat(
                    resp.data.content.songs.map((song, idx) => {
                      return (
                        <SongList
                          key={song.song_id}
                          id={song.song_id}
                          index={idx}
                          song_name={song.song_name}
                          song_type={song.song_type}
                          raga={song.song_raga}
                          tuned_by={song.tuner_name}
                          lyricist={song.lyricist_name}
                          composer={song.composer_name}
                          lyrics={song.song_lyrics}
                          isFavorite={song.isFavorite}
                          duration={calculateTime(song.song_duration)}
                          editSong={(v) => handleEdit(v)}
                          songDetails={(v) => hanldeDetails(v)}
                          handleError={(err) => handleError(err)}
                          handleLyrics={(v) => handleLyrics(v)}
                        />
                      );
                    })
                  )
                )
              );
          }
        }
      }
    }
  }, [scrollPercentage, currentView]);

  useEffect(() => {
    setPage(1);
    setMaxReached(false);
    setLoading(false);
    setShowResults(false);
    setSearchResults(null);
    listedSongs();
    if (currentView.view_name !== "fullscreen-lyrics") {
      setShowLyricsFullscreen(false);
    }
    const div = document.querySelector(".mainview");
    div.scrollTo({
      top: 0,
    });
  }, [currentView]);

  const listedSongs = () => {
    const songsArray = data.map((song, idx) => {
      return (
        <SongList
          key={song.song_id}
          id={song.song_id}
          index={idx}
          song_name={song.song_name}
          song_type={song.song_type}
          raga={song.song_raga}
          tuned_by={song.tuner_name}
          lyricist={song.lyricist_name}
          composer={song.composer_name}
          lyrics={song.song_lyrics}
          isFavorite={song.isFavorite}
          duration={calculateTime(song.song_duration)}
          editSong={(v) => handleEdit(v)}
          songDetails={(v) => hanldeDetails(v)}
          handleError={(err) => handleError(err)}
          handleLyrics={(v) => handleLyrics(v)}
        />
      );
    });
    currentView.view_name === "playlist"
      ? setSongsList(songsArray)
      : setSearchResults(songsArray);
  };

  const handleSearch = (searchQuery, field) => {
    setLoading(true);
    setField(field);
    setSearchQuery(searchQuery);

    searchQuery !== "" &&
      axios
        .get(
          `${URL}/api/search?query=${searchQuery}&field=${field}&page=${page}`
        )
        .then((resp) => {
          updateData(resp.data.content.results);
          updateMaxPages(resp.data.content.max_page);
          listedSongs();
          setLoading(false);
          setFocused(false);
          setShowResults(true);
        });

    if (searchQuery === "") {
      setLoading(false);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleEdit = (values) => {
    setEditSong(true);
    setEditItems(values);
  };

  const hanldeDetails = (values) => {
    setDetails(values);
    setShowDetails(true);
  };

  const handleError = (error) => {
    setTimeout(() => setChecked(false), 1900);
    setTimeout(() => setError(""), 2100);
    setError(error);
    setChecked(true);
  };

  const handleLyrics = (lyrics) => {
    setLyrics(lyrics);
    setShowLyrics(true);
  };

  const handleLyricsFullscreen = () => {
    setShowLyricsFullscreen(true);
    setPrevView(currentView);
    setCurrView({
      name: "lyrics",
      playlist_id: null,
      view_name: "fullscreen-lyrics",
    });
  };

  const handleFullscreenClose = () => {
    setCurrView(prevView);
    setShowLyricsFullscreen(false);
  };

  return (
    <>
      <div className="mainview" ref={scrollRef}>
        <div className="error-box-holder">
          <Box className="error-container">
            <Slide direction="down" in={checked} container={scrollRef.current}>
              <Box
                color={"error"}
                sx={{ color: "black", backgroundColor: "white" }}
                className="error-box"
              >
                {error}
              </Box>
            </Slide>
          </Box>
        </div>

        {showLyricsFullscreen && (
          <LyricsFullScreen
            lyrics={lyrics}
            handleClose={handleFullscreenClose}
          />
        )}

        {showForm && (
          <div className="open-form absolute">
            <AddSongForm className="absolute" />
          </div>
        )}

        {showPlaylistForm && (
          <div className="open-form">
            <AddPlaylistForm className="absolute" />
          </div>
        )}
        {showEditSong && (
          <EditForm
            open={showEditSong}
            close={(v) => setEditSong(v)}
            values={editItems}
          />
        )}
        {showDetails && (
          <Details
            values={details}
            open={showDetails}
            close={(v) => setShowDetails(v)}
          />
        )}
        {currentView.view_name && currentView.view_name === "search" && (
          <>
            <Search
              handleSearch={(q, f) => handleSearch(q, f)}
              focused={focused}
              setFocused={(v) => setFocused(v)}
              loading={loading}
            />
            {showResults && (
              <div className="list-container">
                {searchResults.length > 0 ? (
                  searchResults
                ) : (
                  <h3 className="not-found-text">No songs found</h3>
                )}
                <div className="footing"></div>
              </div>
            )}
          </>
        )}
        {currentView.playlist_id !== null && (
          <>
            <div className="top-content-container">
              <div className="title-container">
                <h1 className="title">{currentView.name}</h1>
                {numOfSongs !== 0 && (
                  <p className="num-of-songs">
                    <span className="number">{numOfSongs}</span> songs
                  </p>
                )}
              </div>
              {showLyrics && (
                <Lyrics
                  setShowLyrics={(v) => setShowLyrics(v)}
                  lyrics={lyrics}
                  handleFullScreen={handleLyricsFullscreen}
                />
              )}
            </div>
            <div className="list-container">
              {currentView.playlist_id === 0 && songsList.length === 0 ? (
                <h3 className="not-found-text">No songs found</h3>
              ) : (
                songsList
              )}
              {currentView.playlist_id !== 0 && selecting && (
                <NoSongs page={page} />
              )}
              {SongList.length > 5 && <div className="footing"></div>}
            </div>
          </>
        )}
        {currentView.view_name && currentView.view_name === "home" && (
          <HomeView />
        )}
      </div>
    </>
  );
}

export default Mainview;

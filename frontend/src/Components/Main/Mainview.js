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
  useIsPlayingContext,
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
import ImageViewer from "./LyricsViews/ImageViewer";

function Mainview() {
  const { data, updateData, searchFocused } = useSongContext();
  const { showForm } = useFormShowContext();
  const { showPlaylistForm } = useShowPlaylistForm();
  const { currentView, setCurrView } = useViews();
  const { maxPages } = useMaxPages();
  const { numOfSongs } = useNumberOfSongs();
  const { page, setPage, maxReached, setMaxReached, currentPlayingPlaylist } =
    useIsPlayingContext();
  const URL = useUrl();

  const [songsList, setSongsList] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [prevView, setPrevView] = useState("");
  const [focused, setFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
  const [showImages, setShowImages] = useState(false);
  const [songImageId, setSongImageId] = useState("");
  const [songImageMaxPages, setSongImageMaxPages] = useState(null);

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
    if (
      currentView.playlist_id !== null ||
      currentView.view_name === "search"
    ) {
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
    if (page === maxPages || data.length === numOfSongs) {
      setMaxReached(true);
    } else {
      setMaxReached(false);
    }
  }, [page, data]);

  useEffect(() => {
    if (scrollPercentage >= 70 && scrollPercentage < 100) {
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
              .then((resp) => {
                updateData((prev) => prev.concat(resp.data.content.songs));
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
                          handleShowImages={(id, mp) =>
                            handleShowImages(id, mp)
                          }
                        />
                      );
                    })
                  )
                );
              });
          }
        }
      }
    }
  }, [scrollPercentage, currentView]);

  useEffect(() => {
    if (currentView.playlist_id !== currentPlayingPlaylist) {
      setPage(1);
      setMaxReached(false);
    }
    if (currentView.view_name !== "fullscreen-lyrics") {
      setShowLyricsFullscreen(false);
    }
    if (currentView.view_name !== "image-lyrics") {
      setShowImages(false);
      setSongImageId("");
      setShowImages(null);
    }
    setShowResults(false);
    setSearchResults(null);

    listedSongs();
    const div = document.querySelector(".mainview");
    div.scrollTo({
      top: 0,
    });
  }, [currentView]);

  useEffect(() => {
    setPage(1);
    setMaxReached(false);
  }, [currentPlayingPlaylist]);

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
          handleLyricsFullscreen={handleLyricsFullscreen}
          handleShowImages={(id, mp) => handleShowImages(id, mp)}
        />
      );
    });
    currentView.view_name === "playlist"
      ? setSongsList(songsArray)
      : setSearchResults(songsArray);
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
    if (!checked) {
      setError(error);
      setChecked(true);
    }
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

  const handleSpace = (e) => {
    if (e.key === " " && !searchFocused) {
      e.preventDefault();
    }
  };

  const handleShowImages = (songId, maxPages) => {
    setSongImageId(songId);
    setSongImageMaxPages(maxPages);
    setPrevView(currentView);
    setCurrView({
      name: "lyrics",
      playlist_id: null,
      view_name: "image-lyrics",
    });
    setShowImages(true);
  };

  const handleCloseImages = () => {
    setShowImages(false);
    setSongImageId("");
    setShowImages(null);
    setCurrView(prevView);
  };
  return (
    <>
      <div
        className="mainview"
        ref={scrollRef}
        onKeyDown={(e) => handleSpace(e)}
      >
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

        {showImages && (
          <ImageViewer
            songId={songImageId}
            maxPages={songImageMaxPages}
            handleClose={handleCloseImages}
            handleError={(e) => handleError(e)}
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
              focused={focused}
              setFocused={(v) => setFocused(v)}
              setShowResults={(v) => setShowResults(v)}
              setSearchResults={(v) => setSearchResults(v)}
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
            </div>
            {songsList.length > 10 && <div className="footing"></div>}
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

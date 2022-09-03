import React from "react";
import { FaStepBackward, FaStepForward } from "react-icons/fa";
import {
  ImVolumeHigh,
  ImVolumeMedium,
  ImVolumeLow,
  ImVolumeMute2,
} from "react-icons/im";
import { useState, useRef, useEffect } from "react";
import { GrPlayFill, GrPauseFill } from "react-icons/gr";
import { FaMusic } from "react-icons/fa";
import {
  useCurrentSong,
  useIsPlayingContext,
  UpdateCurrSong,
  useSongContext,
  useViews,
  useMaxPages,
  useUrl,
  useNumberOfSongs,
} from "../../Hooks/SongProvider";
import axios from "axios";

function AudioPlayer() {
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volSymbol, setSymbol] = useState("");
  const [isEnded, setEnded] = useState(false);
  const [prevEnded, setPrevEnded] = useState(false);
  const [index, setIndex] = useState(undefined);
  const [songList, setSongList] = useState(null);
  const [view, setView] = useState(null);
  const [currentPlayingPlaylist, setCurrentPlaylingPlaylist] = useState(0);
  const [maxReached, setMaxReached] = useState(false);
  const [page, setPage] = useState(1);

  const audioPlayer = useRef(); //References our audio component
  const progressBar = useRef(); //References out progress bar
  const animationRef = useRef(); //References knob
  const volumeBar = useRef(); //References volume component

  const urlId = useCurrentSong(); // Song id to play
  const { numOfSongs } = useNumberOfSongs();
  const updateCurrSong = UpdateCurrSong();
  const { maxPages } = useMaxPages();
  const URL = useUrl();
  const { data, updateData } = useSongContext();
  const {
    currIsPlaying,
    updateIsPlaying,
    songname,
    setSongname,
    providerIndex,
    setProvIndex,
  } = useIsPlayingContext(); // State of song
  const { currentView } = useViews();

  useEffect(() => {
    if (typeof window !== undefined) {
      const prevId = localStorage.getItem("urlId");
      updateCurrSong(prevId);
      volumeBar.current.value = localStorage.getItem("volume") * 100;
      audioPlayer.current.volume = localStorage.getItem("volume");
      progressBar.current.value = localStorage.getItem("prevTime");
      audioPlayer.current.currentTime = localStorage.getItem("prevTime");
      volumeBar.current.style.setProperty(
        "--volume-before-width",
        `${volumeBar.current.value}%`
      );

      changeVolSymbol(audioPlayer.current.volume);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (!currIsPlaying) {
        progressBar.current.value = localStorage.getItem("prevTime");
        audioPlayer.current.currentTime = localStorage.getItem("prevTime");
        setCurrentTime(localStorage.getItem("prevTime"));
      }
    }
  }, [progressBar?.current, audioPlayer?.current]);

  useEffect(() => {
    if (urlId) {
      if (data[0]) {
        if (index === undefined) {
          data.map((song, idx) => {
            if (String(song.song_id) === String(urlId)) {
              setIndex(idx);
              setSongname({ name: song.song_name, type: song.song_type });
            } else if (
              idx === data.length - 1 &&
              String(song.song_id) !== String(urlId)
            ) {
              setPage((prev) => prev + 1);
              if (!maxReached) {
                axios
                  .get(
                    `${URL}/api/playlist/${currentPlayingPlaylist}?page=${
                      page + 1
                    }`
                  )
                  .then((resp) => {
                    if (resp.data.content.songs[0]) {
                      if (data.length !== numOfSongs) {
                        updateData((prev) =>
                          prev.concat(resp.data.content.songs)
                        );
                        setSongList((prev) => {
                          if (!prev) {
                            return resp.data.content.songs;
                          } else {
                            return prev.concat(resp.data.content.songs);
                          }
                        });
                      }
                    }
                  })
                  .catch(() => {
                    return;
                  });
              }
            }
          });
        }
      }
    }
  }, [urlId, data, page]);

  useEffect(() => {
    if (providerIndex !== undefined) {
      setIndex(providerIndex);
      if (view) {
        setCurrentPlaylingPlaylist(view.playlist_id);
        setPage(1);
        setMaxReached(false);
        setProvIndex(undefined);
      }
    }
  }, [providerIndex]);

  useEffect(() => {
    if (view) {
      if (
        view.view_name === "playlist" &&
        view.playlist_id === currentPlayingPlaylist
      ) {
        setSongList(data);
        setPage(1);
        setMaxReached(false);
      }
    }
  }, [currentPlayingPlaylist]);

  useEffect(() => {
    if (view) {
      if (
        view.view_name === "playlist" &&
        view.playlist_id === currentPlayingPlaylist
      ) {
        if (songList && songList.length !== numOfSongs) {
          setSongList(data);
        }
      }
    }
  }, [data, numOfSongs]);

  useEffect(() => {
    if (currentView) {
      if (currentView.view_name !== "playlist" && !view?.view_name) {
        setView({ name: "Songs", playlist_id: 0, view_name: "playlist" });
      }
      if (currentView.view_name === "playlist") {
        if (view && view.view_name === "playlist") {
          setView(currentView);
        }
      }
    }
    if (view) {
      if (
        view.view_name === "playlist" &&
        view.playlist_id !== currentPlayingPlaylist
      ) {
        setMaxReached(false);
      }
    }
  }, [currentView]);

  useEffect(() => {
    if (data[index]) {
      const dur = Math.floor(data[index].song_duration);
      setDuration(dur);
      if (view) {
        if (
          view.view_name === "playlist" &&
          view.playlist_id === currentPlayingPlaylist
        ) {
          if (!currIsPlaying) {
            setSongList(data);
          }
        }
      }
      if (typeof window !== undefined) {
        localStorage.setItem("urlId", data[index].song_id);
      }
    }
  }, [index]);

  useEffect(() => {
    if (data[index]) {
      if (!currIsPlaying) {
        if (typeof window !== undefined) {
          const prevTime = localStorage.getItem("prevTime");
          audioPlayer.current.currentTime = prevTime;
          progressBar.current.value = prevTime;
          if (!isNaN(duration)) {
            progressBar.current.style.setProperty(
              "--seek-before-width",
              `${
                (progressBar?.current?.value / data[index].song_duration) * 100
              }%`
            );
          }
          setCurrentTime(prevTime);
        }
      }
    }
  }, [data, index]);

  useEffect(() => {
    if (currIsPlaying === false && isPlaying === true) {
      audioPlayer?.current?.pause();
      cancelAnimationFrame(animationRef.current);
      updateIsPlaying(true);
    }
    if (songList && songList[index]) {
      setDuration(Math.floor(songList[index].song_duration));
    }
  }, [urlId]);

  useEffect(() => {
    try {
      if (currIsPlaying) {
        songList[index] &&
          setDuration(Math.floor(Math.floor(songList[index].song_duration)));
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
        setPlaying(true);
      } else {
        audioPlayer.current.pause();
        cancelAnimationFrame(animationRef.current);
        setPlaying(false);
      }
    } catch (err) {
      return;
    }
  }, [currIsPlaying]);

  useEffect(() => {
    if (isPlaying && currIsPlaying === true) {
      if (Number(currentTime) === duration) {
        updateIsPlaying(false);
        audioPlayer?.current?.pause();
        cancelAnimationFrame(animationRef.current);
        setEnded(true);
      }
    }
    if (currentTime < duration) {
      setEnded(false);
    }
  }, [currentTime]);

  useEffect(() => {
    if (songList) {
      if (page === maxPages) {
        setMaxReached(true);
      }
    }
  }, [page]);

  useEffect(() => {
    if (songList) {
      if (index >= songList.length - 2) {
        if (!maxReached) {
          if (view.view_name === "playlist") {
            setPage((prev) => prev + 1);
            axios
              .get(
                `${URL}/api/playlist/${currentPlayingPlaylist}?page=${page + 1}`
              )
              .then((resp) => {
                if (resp.data.content.songs[0]) {
                  if (
                    view.playlist_id === currentPlayingPlaylist &&
                    data.length !== numOfSongs
                  ) {
                    updateData((prev) => prev.concat(resp.data.content.songs));
                  }
                  setSongList((prev) => prev.concat(resp.data.content.songs));
                }
              })
              .catch(() => {
                return;
              });
          }
        }
      }
    }
  }, [index, view]);

  useEffect(() => {
    if (isPlaying === true && Number(currentTime) === duration) {
      setEnded(true);
      updateIsPlaying(false);
      audioPlayer?.current?.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    try {
      if (isEnded) {
        if (songList[index]) {
          if (songList[index].song_id === urlId) {
            let element;
            if (songList[index + 1] === undefined) {
              element = songList[0];
              setIndex(0);
            } else {
              element = songList[index + 1];
              setIndex((prev) => prev + 1);
            }
            updateCurrSong(element.song_id);
            setDuration(Math.floor(element.song_duration));
            cancelAnimationFrame(animationRef.current);
            if (audioPlayer?.current?.readyState === 4) {
              progressBar.current.value = 0;
              setSongname({
                name: element.song_name,
                type: element.song_type,
              });
              setPlaying(true);
              updateIsPlaying(true);
              setEnded(false);
            }
          } else {
            setEnded(false);
          }
        }
      }
    } catch (err) {
      return;
    }
  }, [isEnded]);

  useEffect(() => {
    try {
      if (prevEnded) {
        if (songList[index]) {
          if (songList[index].song_id === urlId) {
            let element;

            if (songList[index - 1] === undefined) {
              element = songList.at(-1);
              setIndex(songList.length - 1);
            } else {
              element = songList[index - 1];
              setIndex((prev) => prev - 1);
            }
            updateCurrSong(element.song_id);
            setDuration(Math.floor(element.song_duration));
            cancelAnimationFrame(animationRef.current);
            if (audioPlayer?.current?.readyState === 4) {
              progressBar.current.value = 0;
              setSongname({
                name: element.song_name,
                type: element.song_type,
              });
              setPlaying(true);
              updateIsPlaying(true);
              setPrevEnded(false);
            }
          } else {
            setPrevEnded(false);
          }
        }
      }
    } catch (err) {
      return;
    }
  }, [prevEnded]);

  useEffect(() => {
    const handleResize = () => {
      progressBar?.current?.style.setProperty(
        "width",
        `${window.innerWidth / 4}px`
      );
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handlePlay = () => {
    const prevVal = isPlaying;
    updateIsPlaying(!currIsPlaying);
    setPlaying(!prevVal);
    try {
      songList[index] && setDuration(Math.floor(songList[index].song_duration));
    } catch (err) {
      updateIsPlaying(false);
      setPlaying(!false);
      return;
    }
    if (urlId !== "" || undefined) {
      if (data.length === 1) {
        if (Number(currentTime) === duration) {
          setCurrentTime(0);
          audioPlayer.current.currentTime = 0;
        }
      }
    }
    if (!prevVal) {
      if (audioPlayer?.current?.readyState === 4) {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      }
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = Math.floor(audioPlayer?.current?.currentTime);
    changePlayerCurrentTime();
    if (typeof window !== undefined) {
      localStorage.setItem("prevTime", progressBar.current.value);
    }
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar?.current?.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    if (!isNaN(duration)) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(progressBar?.current?.value / duration) * 100}%`
      );
    }
    setCurrentTime(progressBar.current.value);
  };

  const changeVolume = (muted) => {
    if (typeof window !== "undefined") {
      const volumeStyle = volumeBar.current.value;

      volumeBar.current.style.setProperty(
        "--volume-before-width",
        `${volumeStyle}%`
      );
      audioPlayer.current.volume = volumeBar.current.value / 100;
      localStorage.setItem("volume", volumeBar.current.value / 100);
    }
    changeVolSymbol(audioPlayer.current.volume);
  };

  const handleMute = () => {
    if (!audioPlayer.current.muted) {
      audioPlayer.current.muted = true;
      volumeBar.current.style.setProperty("--volume-before-width", `${0}%`);
      volumeBar.current.value = 0;
      changeVolSymbol(0);
    } else if (audioPlayer.current.muted) {
      audioPlayer.current.muted = false;
      if (typeof window !== "undefined") {
        volumeBar.current.style.setProperty(
          "--volume-before-width",
          `${localStorage.getItem("volume") * 100}%`
        );
        volumeBar.current.value = localStorage.getItem("volume") * 100;
        changeVolSymbol(localStorage.getItem("volume"));
      }
    }
  };

  const changeVolSymbol = (vol) => {
    if (vol >= 0.75) {
      setSymbol(<ImVolumeHigh className="vol-speaker" />);
    }
    if (vol < 0.75 && vol >= 0.25) {
      setSymbol(<ImVolumeMedium className="vol-speaker" />);
    }
    if (vol < 0.25 && vol > 0) {
      setSymbol(<ImVolumeLow className="vol-speaker" />);
    }
    if (vol < 0.01) {
      setSymbol(<ImVolumeMute2 className="vol-speaker" />);
    }
  };

  const handlePlayNext = () => {
    if (!currIsPlaying) {
      setEnded(true);
    }
    if (currIsPlaying && isPlaying === true) {
      setCurrentTime(duration);
    }
  };

  const handlePlayPrev = () => {
    audioPlayer?.current?.pause();
    updateIsPlaying(false);
    setPrevEnded(true);
  };

  const handleSongChange = () => {
    if (currIsPlaying) {
      audioPlayer?.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioPlayer}
        src={`${URL}/api/stream/` + String(urlId)}
        type="audio/mp3"
        preload="metadata"
        onLoadedData={handleSongChange}
      ></audio>
      <div className="container">
        <div className="song-info">
          <div className="song-img">
            <FaMusic className="music-icon" />
          </div>
          <div className="song-meta">
            <h2 className="songname">
              {songname ? (
                songname.name
              ) : (
                <h2 className="songname">Songname</h2>
              )}
            </h2>
            <a className="songtype">{songname ? songname.type : "song type"}</a>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="buttons-container">
            {/* prev song */}
            <button className="forward-backward" onClick={handlePlayPrev}>
              <FaStepBackward className="back" />
            </button>

            {/* play/pause btn */}
            <button className="play-pause" onClick={handlePlay}>
              {isPlaying ? <GrPauseFill /> : <GrPlayFill className="play" />}
            </button>

            {/* next song */}
            <button className="forward-backward" onClick={handlePlayNext}>
              <FaStepForward className="for" />
            </button>
          </div>

          {/* slider for song */}
          <div className="slider-container">
            {<div className="current-time">{calculateTime(currentTime)}</div>}
            <div>
              <input
                type="range"
                className="progress-bar"
                ref={progressBar}
                defaultValue={0}
                onChange={changeRange}
                max={isNaN(duration) ? 0 : duration}
              ></input>
            </div>
            {<div className="duration">{calculateTime(duration)}</div>}
          </div>
        </div>
        {/* volume */}
        <div className="volume-slider">
          <button className="mute-btn" onClick={handleMute}>
            {volSymbol}
          </button>
          <input
            type="range"
            className="volume-bar"
            // onScroll={(e) => handleVolScroll(e)}
            ref={volumeBar}
            onChange={changeVolume}
          />
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;

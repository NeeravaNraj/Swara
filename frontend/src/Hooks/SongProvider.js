import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const SongContext = React.createContext();
const CurrentSongContext = React.createContext();
const UpdateCurrentSong = React.createContext();
const IsPlayingContext = React.createContext();
const ShowFormContext = React.createContext();
const SearchDataContext = React.createContext();
const ViewContext = React.createContext();
const ShowPlaylistFormContext = React.createContext();
const AllPlaylistsContext = React.createContext();
const CurrPlaylistContext = React.createContext();
const MaxPageContext = React.createContext();
const NumberOfSongs = React.createContext();
const urlContext = React.createContext();

export function useFormShowContext() {
  return useContext(ShowFormContext);
}

export function useSongContext() {
  return useContext(SongContext);
}

export function useCurrentSong() {
  return useContext(CurrentSongContext);
}

export function UpdateCurrSong() {
  return useContext(UpdateCurrentSong);
}

export function useIsPlayingContext() {
  return useContext(IsPlayingContext);
}

export function useSearchData() {
  return useContext(SearchDataContext);
}

export function useShowPlaylistForm() {
  return useContext(ShowPlaylistFormContext);
}

export function useAllPlaylists() {
  return useContext(AllPlaylistsContext);
}

export function useViews() {
  return useContext(ViewContext);
}

export function useCurrPlaylistSongs() {
  return useContext(CurrPlaylistContext);
}

export function useMaxPages() {
  return useContext(MaxPageContext);
}

export function useNumberOfSongs() {
  return useContext(NumberOfSongs);
}
export function useUrl() {
  return useContext(urlContext);
}

export function SongContextProvider({ children }) {
  const [data, setData] = useState([]);
  const [currentSong, setCurrentSong] = useState("");
  const [isRunning, setRunning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [currentPlayingPlaylist, setCurrentPlaylingPlaylist] = useState(0);
  const [currentView, setCurrentView] = useState({
    name: "Home",
    playlist_id: null,
    view_name: "home",
  });
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [maxPages, setMaxPages] = useState(1);
  const [page, setPage] = useState(1);
  const [maxReached, setMaxReached] = useState(false);
  const [numOfSongs, setNumOfSongs] = useState(0);
  const [songName, setSongName] = useState({});
  const [providerIndex, setProviderIndex] = useState(undefined);
  const [searchFocused, setSearchFocused] = useState(false);

  function setCurrSong(id) {
    setCurrentSong(id);
  }

  const URL = "http://localhost:5000";

  const controls = {
    currIsPlaying: isRunning,
    updateIsPlaying: (data) => setRunning(data),
    songname: songName,
    setSongname: (v) => setSongName(v),
    providerIndex: providerIndex,
    setProvIndex: (v) => setProviderIndex(v),
    page: page,
    setPage: (v) => setPage(v),
    maxReached: maxReached,
    setMaxReached: (v) => setMaxReached(v),
    currentPlayingPlaylist: currentPlayingPlaylist,
    setCurrentPlaylingPlaylist: (v) => setCurrentPlaylingPlaylist(v),
  };

  const dataControls = {
    data: data,
    updateData: (input) => setData(input),
    searchFocused: searchFocused,
    setSearchFocused: (v) => setSearchFocused(v),
  };

  const showFormControls = {
    showForm: showForm,
    setShow: (input) => setShowForm(input),
  };

  const searchDataControls = {
    searchData: searchData,
    setSearchData: (input) => setSearchData(input),
  };

  const viewControls = {
    currentView: currentView,
    setCurrView: (input) => setCurrentView(input),
  };

  const showPlaylistFormControls = {
    showPlaylistForm: showPlaylistForm,
    setShowPlaylist: (input) => setShowPlaylistForm(input),
  };

  const allPlaylistsControls = {
    allPlaylists: allPlaylists,
    setAllPlaylists: (input) => setAllPlaylists(input),
  };

  const maxPagesControls = {
    maxPages: maxPages,
    updateMaxPages: (input) => setMaxPages(input),
  };

  const numberOfSongsControls = {
    numOfSongs: numOfSongs,
    updateNumOfSongs: (v) => setNumOfSongs(v),
  };

  useEffect(() => {
    axios
      .get(`${URL}/api/songs?page=1`)
      .then((resp) => {
        setData(resp.data.content.songs);
        setMaxPages(resp.data.content.max_pages);
        setNumOfSongs(resp.data.content.numOfSongs);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(`${URL}/api/playlist`).then((resp) => setAllPlaylists(resp.data));
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/api/search-data`)
      .then((resp) => {
        setSearchData(resp.data.content);
      })
      .catch((err) => console.log(err));
  }, [showForm]);

  return (
    <SongContext.Provider value={dataControls}>
      <CurrentSongContext.Provider value={currentSong}>
        <UpdateCurrentSong.Provider value={(id) => setCurrSong(id)}>
          <IsPlayingContext.Provider value={controls}>
            <ShowFormContext.Provider value={showFormControls}>
              <SearchDataContext.Provider value={searchDataControls}>
                <ViewContext.Provider value={viewControls}>
                  <ShowPlaylistFormContext.Provider
                    value={showPlaylistFormControls}
                  >
                    <AllPlaylistsContext.Provider value={allPlaylistsControls}>
                      <MaxPageContext.Provider value={maxPagesControls}>
                        <NumberOfSongs.Provider value={numberOfSongsControls}>
                          <urlContext.Provider value={URL}>
                            {children}
                          </urlContext.Provider>
                        </NumberOfSongs.Provider>
                      </MaxPageContext.Provider>
                    </AllPlaylistsContext.Provider>
                  </ShowPlaylistFormContext.Provider>
                </ViewContext.Provider>
              </SearchDataContext.Provider>
            </ShowFormContext.Provider>
          </IsPlayingContext.Provider>
        </UpdateCurrentSong.Provider>
      </CurrentSongContext.Provider>
    </SongContext.Provider>
  );
}

import React, { useState, useRef, useEffect } from "react";
import "../../../../Stylesheets/Search.css";
import { GoSearch } from "react-icons/go";
import { CircularProgress } from "@mui/material";
import ListItem from "./ListItem";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  SongContextProvider,
  useIsPlayingContext,
  useSongContext,
  useUrl,
} from "../../../../Hooks/SongProvider";

import axios from "axios";

const items = [
  { title: 'Search in "Song name"', colName: "song_name" },
  { title: 'Search in "Song type"', colName: "song_type" },
  { title: 'Search in "Raga"', colName: "song_raga" },
  { title: 'Search in "Composer"', colName: "composer_name" },
  { title: 'Search in "Lyricist"', colName: "lyricist_name" },
  { title: 'Search in "Tuned by"', colName: "tuner_name" },
];

function Search({ focused, setFocused, setShowResults, setSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(undefined);
  const [currChecked, setChecked] = useState("");
  const [loading, setLoading] = useState(false);
  const { page } = useIsPlayingContext();
  const { updateData, setSearchFocused, searchFocused } = useSongContext();
  const [field, setField] = useState("");
  const URL = useUrl();

  const searchBar = useRef();
  const dropdown = useRef();

  useEffect(() => {
    searchBar.current.focus();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery, field);
    if (selected === undefined) {
      handleSearch(searchQuery, undefined);
    }
    if (selected !== undefined) {
      handleSearch(searchQuery, selected);
    }
  }, [searchQuery]);

  const handleOnChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (searchQuery, field) => {
    setLoading(true);
    setField(field);

    if (searchQuery === "") {
      setLoading(false);
      setSearchResults([]);
      setShowResults(false);
    }

    searchQuery !== "" &&
      axios
        .get(
          `${URL}/api/search?query=${searchQuery}&field=${field}&page=${page}`
        )
        .then((resp) => {
          updateData(resp.data.content.results);
          setLoading(false);
          setFocused(false);
          setShowResults(true);
        });
  };

  const OutsideClickHandle = (ref) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (document.activeElement === searchBar.current) {
          setSearchFocused(true);
        } else {
          setSearchFocused(false);
        }
        if (dropdown.current && !ref.current.contains(e.target)) {
          setFocused(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  OutsideClickHandle(dropdown);

  const OutsideClickHandleSearch = (ref) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (document.activeElement === searchBar.current) {
          setSearchFocused(true);
        } else {
          setSearchFocused(false);
        }
      };
      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [ref]);
  };

  OutsideClickHandleSearch(searchBar);

  const checkboxOnChange = (item) => {
    setSelected(item);
    setChecked(item);

    if (currChecked === item) {
      setChecked(undefined);
      setSelected(undefined);
    }
  };

  return (
    <>
      <div className="searchbar-container">
        <div className="searchbar">
          <GoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onChange={(e) => handleOnChange(e)}
            ref={searchBar}
          />
          <HiDotsHorizontal
            className="details"
            onClick={() => setFocused((prev) => !prev)}
          />
        </div>

        {focused && (
          <div className="suggestions-container" ref={dropdown}>
            {items.map((item, i) => (
              <ListItem
                key={i}
                indx={i}
                item={item}
                setSelected={setSelected}
                handleSearch={(s, f) => handleSearch(s, f)}
                currChecked={currChecked}
                searchQuery={searchQuery}
                onchange={(v) => checkboxOnChange(v)}
              />
            ))}
          </div>
        )}
        <div className="spinner-container">
          {loading && <CircularProgress color="inherit" />}
        </div>
      </div>
    </>
  );
}

export default Search;

import React, { useState, useRef, useEffect } from "react";
import "../../../../Stylesheets/Search.css";
import { GoSearch } from "react-icons/go";
import { CircularProgress } from "@mui/material";
import ListItem from "./ListItem";
import { HiDotsHorizontal } from "react-icons/hi";

const items = [
  { title: 'Search in "Song name"', colName: "song_name" },
  { title: 'Search in "Song type"', colName: "song_type" },
  { title: 'Search in "Raga"', colName: "song_raga" },
  { title: 'Search in "Composer"', colName: "composer_name" },
  { title: 'Search in "Lyricist"', colName: "lyricist_name" },
  { title: 'Search in "Tuned by"', colName: "tuner_name" },
];

function Search({ handleSearch, focused, setFocused, loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(undefined);
  const [currChecked, setChecked] = useState("");

  const searchBar = useRef();
  const dropdown = useRef();

  useEffect(() => {
    searchBar.current.focus();
  }, []);

  const handleOnChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const OutsideClickHandle = (ref) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
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

  useEffect(() => {
    if (selected === undefined) {
      handleSearch(searchQuery, undefined);
    }
    if (selected !== undefined) {
      handleSearch(searchQuery, selected);
    }
  }, [searchQuery]);

  const checkboxOnChange = (item) => {
    setSelected(item);
    setChecked(item);

    if (currChecked === item){
      setChecked(undefined)
      setSelected(undefined)
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
            onClick={() => setFocused(prev => !prev)}
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

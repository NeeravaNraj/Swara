import React, { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  Button,
  TextField,
  Autocomplete,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useSearchData,
  useSongContext,
  useUrl,
} from "../../../../Hooks/SongProvider";
import { TiTick } from "react-icons/ti";
import { orange } from "@mui/material/colors";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function EditForm({ open, close, values }) {
  const [name, setName] = useState(values.song_name);
  const [raga, setRaga] = useState(values.raga);
  const [type, setType] = useState(values.song_type);
  const [lyrics, setLyrics] = useState(values.lyrics);
  const [composer, setComposer] = useState(values.composer);
  const [lyricist, setLyricist] = useState(values.lyricist);
  const [tuner, setTuner] = useState(values.tuned_by);

  const { searchData } = useSearchData();

  const [composerSearchData, setComposerSearchData] = useState([]);
  const [lyricistSearchData, setLyricistSearchData] = useState([]);
  const [tunerSearchData, setTunerSearchData] = useState([]);
  const [ragaSearchData, setRagaSearchData] = useState([]);
  const [songTypeSearchData, setSongTypeSearchData] = useState([]);

  const [isUploaded, setUploaded] = useState(false);
  const { updateData, setSearchFocused } = useSongContext();
  const URL = useUrl();

  useEffect(() => {
    if (Object.values(searchData).length !== 0) {
      setComposerSearchData(searchData.composers);
      setLyricistSearchData(searchData.lyricists);
      setTunerSearchData(searchData.tuners);
      setRagaSearchData(searchData.ragas);
      setSongTypeSearchData(searchData.types);
    }
  }, [searchData]);

  const dataUpdation = (newSongInfo) => {
    updateData((prev) => {
      return prev.map((song) => {
        if (song.song_id === newSongInfo.song_id) {
          return {
            ...song,
            song_name: newSongInfo.song_name,
            song_type: newSongInfo.song_type,
            song_raga: newSongInfo.song_raga,
            song_lyrics: newSongInfo.song_lyrics,
            composer_name: newSongInfo.composer_name,
            lyricist_name: newSongInfo.lyricist_name,
            tuner_name: newSongInfo.tuner_name,
            isFavorite: newSongInfo.isFavorite,
          };
        } else {
          return song;
        }
      });
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedSong = {
      id: values.id,
      song_name: name,
      song_type: type,
      song_raga: raga,
      song_lyrics: lyrics,
      composer_name: composer ? composer : "unknown",
      lyricist_name: lyricist ? lyricist : "unknown",
      tuned_by: tuner ? tuner : "unknown",
    };

    axios
      .patch(`${URL}/api/songs/${values.id}`, updatedSong, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        const newSongInfo = resp.data.content;
        setTimeout(() => close(false), 1000);
        setTimeout(() => setUploaded(false), 1000);
        dataUpdation(newSongInfo[0]);
        setUploaded(true);
        setSearchFocused(false);
      });
  };

  const handleClose = () => {
    close(false);
    setSearchFocused(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className="flex-reset">
      {isUploaded ? (
        <div className="upload-success" onClick={() => close(false)}>
          <TiTick className="tick" />
          <h2 className="success-text">Changes made</h2>
        </div>
      ) : (
        <div className="form-scroll">
          <form
            className="add-song-form"
            onKeyDown={(e) => {
              if (String(e.key) === "Enter") {
                e.preventDefault();
              }
            }}
            onSubmit={(e) => onSubmit(e)}
            autoComplete="off"
          >
            <ThemeProvider theme={theme}>
              <TextField
                name="song_name"
                label="Song name"
                multiline={false}
                required={true}
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Autocomplete
                name="song_type"
                options={songTypeSearchData}
                required={true}
                freeSolo={true}
                fullWidth
                value={type}
                onChange={(e, v) => setType(v)}
                // getOptionLabel={(option) => option || ""}
                // autoSelect
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Song type"
                      sx={{ mb: 2 }}
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                  );
                }}
              />
              <Stack direction={"row"} spacing={2}>
                <Autocomplete
                  name="raga"
                  options={ragaSearchData}
                  required={true}
                  freeSolo={true}
                  fullWidth
                  value={raga}
                  onChange={(e, v) => setRaga(v)}
                  //   getOptionLabel={(option) => option || ""}
                  autoSelect
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Raga"
                        sx={{ mb: 2 }}
                        value={raga}
                        onChange={(e) => setRaga(e.target.value)}
                      />
                    );
                  }}
                />
                <Autocomplete
                  name="composer"
                  label="Composer"
                  options={composerSearchData}
                  required={false}
                  freeSolo={true}
                  fullWidth
                  value={composer}
                  onChange={(e, v) => setComposer(v)}
                  getOptionLabel={(option) => option || ""}
                  autoSelect
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Composer"
                        sx={{ mb: 2 }}
                        value={composer}
                        onChange={(e) => setComposer(e.target.value)}
                      />
                    );
                  }}
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <Autocomplete
                  name="lyricist"
                  options={lyricistSearchData}
                  required={false}
                  freeSolo={true}
                  value={lyricist}
                  onChange={(e, v) => setLyricist(v)}
                  getOptionLabel={(option) => option || ""}
                  fullWidth
                  autoSelect
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Lyricist"
                        sx={{ mb: 2 }}
                        value={lyricist}
                        onChange={(e) => setLyricist(e.target.value)}
                      />
                    );
                  }}
                />
                <Autocomplete
                  name="tuned_by"
                  options={tunerSearchData}
                  required={false}
                  freeSolo={true}
                  value={tuner}
                  fullWidth
                  onChange={(e, v) => setTuner(v)}
                  getOptionLabel={(option) => option || ""}
                  autoSelect
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Tuned by"
                        sx={{ mb: 2 }}
                        value={tuner}
                        onChange={(e) => setTuner(e.target.value)}
                      />
                    );
                  }}
                />
              </Stack>

              <TextField
                name="lyrics"
                label={"Lyrics"}
                multiline={true}
                rows={3}
                required={false}
                sx={{ mb: 2 }}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
              />
              <div className="sub-close">
                <Button
                  onClick={handleClose}
                  size="large"
                  color="error"
                  variant="outlined"
                >
                  Close
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="success"
                >
                  Submit
                </Button>
              </div>
            </ThemeProvider>
          </form>
        </div>
      )}
    </Modal>
  );
}

export default EditForm;

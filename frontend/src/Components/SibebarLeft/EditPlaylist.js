import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  useAllPlaylists,
  useUrl,
  useSongContext,
} from "../../Hooks/SongProvider";
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

function EditPlaylist({ open, close, values }) {
  const { setAllPlaylists } = useAllPlaylists();
  const { setSearchFocused } = useSongContext();

  const [plName, setPlName] = useState(values.pl_name);
  const [isUploaded, setUploaded] = useState(false);
  const { pl_id } = values;
  const URL = useUrl();

  const makePlaylistNameChanges = (updatedName) => {
    setAllPlaylists((prev) => {
      return prev.map((playlist) => {
        if (playlist.playlist_id === updatedName.playlist_id) {
          return {
            ...playlist,
            playlist_name: updatedName.playlist_name,
          };
        } else {
          return playlist;
        }
      });
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const playlistEditPatch = {
      playlist_name: plName,
    };
    axios
      .patch(`${URL}/api/playlist/${pl_id}`, playlistEditPatch, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        const updatedPlaylist = resp.data.content;
        setTimeout(() => close(false), 1000);
        setTimeout(() => setUploaded(false), 1000);
        makePlaylistNameChanges(updatedPlaylist);
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
            onSubmit={(e) => onSubmit(e)}
            onKeyDown={(e) => {
              if (String(e.key) === "Enter") {
                e.preventDefault();
              }
            }}
            autoComplete="off"
          >
            <ThemeProvider theme={theme}>
              <TextField
                label="playlist_name"
                value={plName}
                name="playlist_name"
                onChange={(e) => setPlName(e.target.value)}
              />
              <div className="sub-close">
                <Button
                  size="large"
                  color="error"
                  variant="outlined"
                  onClick={handleClose}
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

export default EditPlaylist;

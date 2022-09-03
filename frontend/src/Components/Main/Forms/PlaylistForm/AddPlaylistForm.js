import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import FormInputText from "../FormElements/FormInputText";
import { Button } from "@mui/material";
import { useShowPlaylistForm, useAllPlaylists, useUrl } from "../../../../Hooks/SongProvider";
import {nanoid} from 'nanoid'

function AddPlaylistForm() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      playlist_id: nanoid(20),
    },
  });
  const { setShowPlaylist } = useShowPlaylistForm();
  const { setAllPlaylists } = useAllPlaylists();
  const URL = useUrl()

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("playlist_name", data.playlist_name);
    axios
      .post(`${URL}/api/playlist`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setShowPlaylist(false);
        return res;
      })
      .then((resp) =>
        setAllPlaylists((prev) => [...prev, resp.data.content[0]])
      );
  };
  const handleClose = () => {
    setShowPlaylist(false);
  };
  return (
    <>
      <div className="background" onClick={handleClose}></div>
      <div className="form-container">
        <div className="flex-reset">
          <div className="form-scroll">
            <form
              className="add-song-form"
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <FormInputText
                name="playlist_name"
                control={control}
                label="Playlist name"
                multiline={false}
                required={true}
              />
              <div className="sub-close">
                <Button
                  className="close-btn"
                  size="large"
                  color="error"
                  variant="outlined"
                  onClick={handleClose}
                >
                  Close
                </Button>

                <Button
                  type="submit"
                  // className="submit-btn"
                  variant="contained"
                  size="large"
                  color="success"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPlaylistForm;

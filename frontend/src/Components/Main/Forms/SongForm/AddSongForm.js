import React, { useEffect } from "react";
import { useState } from "react";
import "../../../../Stylesheets/./Form.css";
import { Button, Stack, Box, Slide, CircularProgress } from "@mui/material";
import { TiTick } from "react-icons/ti";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import {
  useSongContext,
  useFormShowContext,
  useSearchData,
  useNumberOfSongs,
  useUrl,
} from "../../../../Hooks/SongProvider";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import FormInputText from "../FormElements/FormInputText";
import FormInputAutoComplete from "../FormElements/FormInputAutoComplete";

const AddSongForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: nanoid(20),
    },
  });

  const [composerSearchData, setComposerSearchData] = useState([]);
  const [lyricistSearchData, setLyricistSearchData] = useState([]);
  const [tunerSearchData, setTunerSearchData] = useState([]);
  const [ragaSearchData, setRagaSearchData] = useState([]);
  const [songTypeSearchData, setSongTypeSearchData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [file, setFile] = useState(null);
  const [isUploaded, setUploaded] = useState(false);

  const { setShow } = useFormShowContext();
  const { searchData } = useSearchData();
  const { updateData } = useSongContext();
  const { updateNumOfSongs } = useNumberOfSongs();
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

  const fileChangeHandle = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (fdata) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", fdata.id);
    formData.append("song_name", fdata.song_name);
    formData.append("raga", fdata.raga);
    formData.append("song_type", fdata.song_type);
    formData.append(
      "tuned_by",
      fdata.tuned_by === "" ? "unknown" : fdata.tuned_by
    );
    formData.append(
      "composer",
      fdata.composer === "" ? "unknown" : fdata.composer
    );
    formData.append(
      "lyricist",
      fdata.lyricist === "" ? "unknown" : fdata.lyricist
    );
    formData.append("lyrics", fdata.lyrics);
    formData.append("song_path", file);

    await axios
      .post(`${URL}/api/songs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setTimeout(() => setIsLoading(false), 1000);
        setTimeout(() => setShow(false), 1000);
        setTimeout(() => setUploaded(false), 1000);
        setUploaded(true);
        return res;
      })
      .then((resp) => {
        updateData((prev) => [...prev, resp.data.data[0]]);
        updateNumOfSongs((prev) => prev + 1);
      })
      .catch((err) => {
        setTimeout(() => {
          setIsError(false);
          setIsLoading(false);
          setShow(false);
        }, 1000);
        setIsError(true);
        console.log(err);
      });
  };

  const onClickHandleFormClose = () => {
    setShow(false);
    setUploaded(false);
  };

  const handleFileSubmit = () => {
    if (!file) {
      handleError("Please upload audio file.");
    }
  };

  const handleError = (error) => {
    setTimeout(() => setChecked(false), 2000);
    setTimeout(() => setError(""), 2300);
    setError(error);
    setChecked(true);
  };

  return (
    <>
      <div className="form-error-box">
        <Box className="error-container-form">
          <Slide direction="down" in={checked} mountOnEnter unmountOnExit>
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
      <div className="background" onClick={onClickHandleFormClose}></div>
      <div className="form-container">
        <div className="flex-reset">
          {isLoading ? (
            <div
              className={isError ? "upload-error" : "upload-success"}
              onClick={onClickHandleFormClose}
            >
              {!isError ? (
                isUploaded && (
                  <>
                    <TiTick className="tick" />
                    <h2 className="success-text">Upload Success</h2>
                  </>
                )
              ) : (
                <>
                  <IoIosCloseCircleOutline className="cross" />
                  <h2 className="success-text">Something went wrong</h2>
                </>
              )}
              {!isError && !isUploaded && (
                <CircularProgress className="form-loading" />
              )}
            </div>
          ) : (
            <div className="form-scroll">
              <form
                className="add-song-form"
                encType="multipart/form-data"
                onKeyDown={(e) => {
                  if (String(e.key) === "Enter") {
                    e.preventDefault();
                  }
                }}
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                <FormInputText
                  name="song_name"
                  control={control}
                  label="Song name"
                  multiline={false}
                  required={true}
                  focused={true}
                  maxRows={1}
                />

                <FormInputAutoComplete
                  name="song_type"
                  label="Song type"
                  options={songTypeSearchData}
                  control={control}
                  required={true}
                />
                <Stack direction={"row"} spacing={2}>
                  <FormInputAutoComplete
                    name="raga"
                    label="Raga"
                    options={ragaSearchData}
                    control={control}
                    required={true}
                  />
                  <FormInputAutoComplete
                    name="composer"
                    label="Composer"
                    options={composerSearchData}
                    control={control}
                    required={false}
                  />
                </Stack>

                <Stack direction={"row"} spacing={2}>
                  <FormInputAutoComplete
                    name="lyricist"
                    label="Lyricist"
                    options={lyricistSearchData}
                    control={control}
                    required={false}
                  />
                  <FormInputAutoComplete
                    name="tuned_by"
                    label="Tuned by"
                    options={tunerSearchData}
                    control={control}
                    required={false}
                  />
                </Stack>

                <FormInputText
                  name="lyrics"
                  label={"Lyrics"}
                  multiline={true}
                  rows={3}
                  control={control}
                  required={false}
                  focused={false}
                  maxRows={6}
                />
                <div className="audio-file-related">
                  <Button
                    className="audio-file"
                    component="label"
                    variant="contained"
                    color="warning"
                    sx={{ mb: 1, mt: 1 }}
                    size="small"
                    required={true}
                  >
                    {file !== null ? (
                      <TiTick className="tick smalltick" />
                    ) : (
                      "Upload audio file"
                    )}
                    <input
                      type="file"
                      onChange={fileChangeHandle}
                      name="song_path"
                      hidden
                      required
                      accept=".mp3, .ogg, .wav, .m4a"
                    ></input>
                  </Button>
                  {file !== null && (
                    <p className="file-selected">{file?.name}</p>
                  )}
                </div>

                <div className="sub-close">
                  <Button
                    onClick={onClickHandleFormClose}
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
                    onClick={handleFileSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddSongForm;

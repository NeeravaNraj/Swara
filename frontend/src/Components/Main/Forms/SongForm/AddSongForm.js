import React, { useEffect } from "react";
import { useState } from "react";
import "../../../../Stylesheets/./Form.css";
import {
  Button,
  Stack,
  Box,
  Slide,
  CircularProgress,
  Switch,
  FormGroup,
  FormControlLabel,
  Modal,
  IconButton,
} from "@mui/material";
import { TiTick } from "react-icons/ti";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdAddCircle, IoMdCloseCircle } from "react-icons/io";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
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
import ImagePreview from "./ImagePreview";
import ImageListItem from "./ImageListItem";

const AddSongForm = ({ showAp }) => {
  const {
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
  const [isTextLyrics, setIsTextLyrics] = useState(false);
  const [imageTbs, setImageTbs] = useState([]);
  const [viewImg, setViewImg] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");

  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploaded, setUploaded] = useState(false);

  const { setShow } = useFormShowContext();
  const { searchData } = useSearchData();
  const { updateData, setSearchFocused } = useSongContext();
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

  useEffect(() => {
    getImageTbs();
  }, [images]);

  const fileChangeHandle = (e) => {
    let file = e.target.files[0];
    if (file.type.split("/")[0] !== "audio")
      handleError("Please upload an audio file!");
    else setFile(e.target.files[0]);
  };

  const imageChangeHandle = async (e) => {
    if (images.length === 10) {
      handleError("Image upload limit reached(10)!");
      return;
    }
    let files = Object.values(e.target.files);
    let count = 0;
    files.forEach((file) => {
      if (file.type.split("/")[0] !== "image")
        handleError("Please upload an image file!");
      else count++;
    });

    if (files.length > 10) {
      handleError("Please upload only 10 images!");
      return;
    }

    const fileObjs = files.map((file, idx) => {
      return {
        file: file,
        order: idx,
      };
    });

    if (count === files.length) setImages(fileObjs);
  };

  const getImageTbs = async () => {
    const imageTbArr = await Promise.all(
      images.map(async (image, idx) => {
        const contents = await readFile(image.file);
        return (
          <ImagePreview
            key={nanoid(10)}
            src={contents}
            style={{
              maxWidth: "256px",
              maxHeight: "256px",
              borderRadius: "5px",
            }}
            openImg={() => handleImgIdx(idx)}
            removeImg={() => removeImg(idx)}
          />
        );
      })
    );
    setImageTbs(imageTbArr);
  };

  const readFile = async (file) => {
    return new Promise((res, rej) => {
      let fr = new FileReader();
      fr.onload = () => {
        res(fr.result);
      };
      fr.readAsDataURL(file);
    });
  };

  const handleModeChange = (_, v) => {
    setIsTextLyrics(v);
  };

  const onSubmit = async (fdata) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", fdata.id);
    formData.append("song_name", fdata.song_name);
    formData.append("raga", fdata.raga);
    formData.append("song_type", fdata.song_type);
    formData.append("tuned_by", !fdata.tuned_by ? "unknown" : fdata.tuned_by);
    formData.append("composer", !fdata.composer ? "unknown" : fdata.composer);
    formData.append("lyricist", !fdata.lyricist ? "unknown" : fdata.lyricist);
    formData.append("lyrics", fdata.lyrics);
    formData.append("song_path", file);

    for (const image of images) formData.append(`image_path`, image.file);
    setImageTbs([]);

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
        setIsLoading(true);
        setSearchFocused(false);
        updateData((prev) => [...prev, res.data.data[0]]);
        updateNumOfSongs((prev) => prev + 1);
      })
      .catch((err) => {
        setTimeout(() => {
          setIsError(false);
          setIsLoading(false);
          setShow(false);
          setSearchFocused(false);
        }, 1000);
        setIsError(true);
        console.log(err);
      });
  };

  const onClickHandleFormClose = () => {
    setShow(false);
    setUploaded(false);
    setSearchFocused(false);
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

  const handleOrderUp = (orderNum) => {
    let tempArr = images;

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].order === orderNum) {
        let temp = tempArr[i - 1].file;
        tempArr[i - 1].file = tempArr[i].file;
        tempArr[i].file = temp;
        break;
      }
    }
    setImages(tempArr);
    getImageTbs();
  };

  const handleOrderDown = (orderNum) => {
    let tempArr = images;

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].order === orderNum) {
        let temp = tempArr[i + 1].file;
        tempArr[i + 1].file = tempArr[i].file;
        tempArr[i].file = temp;
        break;
      }
    }
    setImages(tempArr);
    getImageTbs();
  };

  const handleImageView = (show) => {
    setViewImg(show);
  };

  const handleImgIdx = async (idx) => {
    readFile(images[idx].file).then((data) => {
      setViewImgSrc(data);
      handleImageView(true);
    });
  };

  const removeImg = (idx) => {
    setImages((prev) => {
      return prev.filter((image, _, arr) => {
        if (image.order !== arr[idx].order) {
          return image;
        }
      });
    });
  };

  const addImage = (e) => {
    if (images.length === 10) {
      handleError("Image upload limit(10) reached!");
      return;
    }
    let files = Object.values(e.target.files);
    let count = 0;
    files.forEach((file) => {
      if (file.type.split("/")[0] !== "image")
        handleError("Please upload an image file!");
      else count++;
    });

    if (files.length + images.length > 10) {
      handleError(`You can only upload ${10 - images.length} more images`);
      return;
    }

    const fileObjs = files.map((file, idx) => {
      return {
        file: file,
        order: images.length + idx,
      };
    });

    if (count === files.length) setImages((prev) => [...prev, ...fileObjs]);
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
      <Modal
        open={viewImg}
        onClose={() => handleImageView(false)}
        className="flex-reset"
      >
        <img
          src={viewImgSrc}
          style={{
            maxWidth: "80vh",
            maxHeight: "80vh",
            borderRadius: "10px",
            display: "block",
          }}
        />
      </Modal>
      <div
        className="background"
        onClick={onClickHandleFormClose}
        style={{ height: showAp ? "90vh" : "100vh" }}
      ></div>
      <div
        className="form-container"
        style={{ height: showAp ? "90vh" : "100vh" }}
      >
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
                    name="lyricist"
                    label="Tala"
                    options={lyricistSearchData}
                    control={control}
                    required={false}
                  />
                </Stack>

                <Stack direction={"row"} spacing={2}>
                  <FormInputAutoComplete
                    name="composer"
                    label="Composer"
                    options={composerSearchData}
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

                {!isTextLyrics ? (
                  <div className="audio-file-related">
                    {!images.length && (
                      <Button
                        className="audio-file"
                        component="label"
                        variant="contained"
                        color="warning"
                        sx={{ mb: 1, mt: 1 }}
                        size="small"
                        required={true}
                      >
                        <p style={{ margin: 0, padding: 0, fontWeight: 400 }}>
                          Upload image
                        </p>

                        <input
                          type="file"
                          onChange={imageChangeHandle}
                          name="image_path"
                          hidden
                          multiple
                          accept=".png, .jpg, .jpeg"
                        ></input>
                      </Button>
                    )}
                    <FormGroup
                      sx={{ position: "relative", top: "3px", color: "white" }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            color="warning"
                            onChange={handleModeChange}
                            value={isTextLyrics}
                          />
                        }
                        label={isTextLyrics ? "Lyrics photo" : "Lyrics text"}
                      />
                    </FormGroup>
                  </div>
                ) : (
                  <>
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
                    <FormGroup
                      sx={{ position: "relative", top: "3px", color: "white" }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            color="warning"
                            onChange={handleModeChange}
                            defaultChecked={isTextLyrics}
                          />
                        }
                        label={isTextLyrics ? "Lyrics photo" : "Lyrics text"}
                      />
                    </FormGroup>
                  </>
                )}
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
                      <p style={{ margin: 0, padding: 0, fontWeight: 400 }}>
                        Upload audio file
                      </p>
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
          {imageTbs.length > 0 && (
            <div className="uploaded-images">
              {imageTbs.map((image, idx) => {
                return (
                  <ImageListItem
                    image={image}
                    idx={idx}
                    images={images}
                    handleOrderDown={(num) => handleOrderDown(num)}
                    handleOrderUp={(num) => handleOrderUp(num)}
                  />
                );
              })}
              <IconButton className="add-image" component="label">
                <IoMdAddCircle />
                <input
                  type="file"
                  onChange={addImage}
                  hidden
                  multiple
                  accept=".png, .jpg, .jpeg"
                />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddSongForm;

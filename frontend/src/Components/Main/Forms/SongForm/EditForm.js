import React, { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  Button,
  TextField,
  Autocomplete,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useSearchData,
  useSongContext,
  useUrl,
} from "../../../../Hooks/SongProvider";
import { IoMdAddCircle } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { orange } from "@mui/material/colors";
import axios from "axios";
import ImageListItem from "./ImageListItem";
import ImagePreview from "./ImagePreview";
import { nanoid } from "nanoid";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function EditForm({ close, values, handleError, showAp }) {
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
  const [hasImages, setHasImages] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [images, setImages] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [viewImg, setViewImg] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [imageTbs, setImageTbs] = useState([]);
  const [tempStart, setTempStart] = useState(null);

  const [isUploaded, setUploaded] = useState(false);
  const { updateData, setSearchFocused } = useSongContext();
  const URL = useUrl();

  useEffect(() => {
    if (firstLoad) hasImgs();
    setFirstLoad(false);
  }, [firstLoad]);

  useEffect(() => {
    if (hasImages) getImages();
  }, [hasImages]);

  useEffect(() => {
    if (images.length > 0) makeImageTbs();
  }, [images]);

  useEffect(() => {
    if (Object.values(searchData).length !== 0) {
      setComposerSearchData(searchData.composers);
      setLyricistSearchData(searchData.lyricists);
      setTunerSearchData(searchData.tuners);
      setRagaSearchData(searchData.ragas);
      setSongTypeSearchData(searchData.types);
    }
  }, [searchData]);

  const urlStreamHelper = (num) => {
    return `${URL}/api/imageStream/${values.id}/${num}?ignore=${Date.now()}`;
  };

  const hasImgs = () => {
    try {
      axios.get(`${URL}/api/imageCheck/${values.id}`).then((mp) => {
        const count = mp.data.count;
        if (count === 0) setHasImages(false);
        if (count > 0) {
          setHasImages(true);
          setTotalImages(count);
        }
      });
    } catch (err) {
      console.log(err);
      return;
      // handleError(err);
    }
  };

  const getImages = () => {
    try {
      axios.get(`${URL}/api/images/${values.id}`).then((resp) => {
        setImages(resp.data.images);
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const makeImageTbs = () => {
    const tbs = images.map((image, idx) => {
      const contents = urlStreamHelper(image.order);
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
    });

    setImageTbs(tbs);
  };

  const handleImageView = (show) => {
    setViewImg(show);
  };

  const handleImgIdx = (idx) => {
    setViewImgSrc(urlStreamHelper(images[idx].order));
    handleImageView(true);
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

  const handleOrderUp = (orderNum) => {
    let tempArr = images;

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].order === orderNum) {
        let temp = tempArr[i - 1].order;
        tempArr[i - 1].order = tempArr[i].order;
        tempArr[i].order = temp;
        break;
      }
    }
    setImages(tempArr);
    makeImageTbs();
  };

  const handleOrderDown = (orderNum) => {
    let tempArr = images;

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].order === orderNum) {
        let temp = tempArr[i + 1].order;
        tempArr[i + 1].order = tempArr[i].order;
        tempArr[i].order = temp;
        break;
      }
    }
    setImages(tempArr);
    makeImageTbs();
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

    if (files.length + totalImages > 10) {
      handleError(
        `You can only upload ${10 - totalImages} more image${
          10 - totalImages === 1 ? "" : "s"
        }`
      );
      return;
    }

    if (count === files.length) {
      setTempFiles(files);
    }
  };

  const setTempFiles = (files) => {
    const formData = new FormData();
    formData.append("id", values.id);
    for (const img of files) formData.append("temp_imgs", img);
    axios
      .post(`${URL}/api/temp/store`, formData)
      .then(() => {
        if (tempStart === null) setTempStart(totalImages);
        hasImgs();
        getImages();
      })
      .catch((err) => console.log(err));
  };

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
      image_path: images,
    };

    setImageTbs([]);

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

  const removeTemps = () => {
    const data = {
      id: values.id,
      start: tempStart,
    };
    axios.post(`${URL}/api/temp/remove`, data);
  };

  const handleClose = (type) => {
    if (tempStart !== null && type === "close") removeTemps();
    close(false);
    setSearchFocused(false);
  };

  return (
    <>
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
        onClick={() => handleClose("close")}
        style={{ height: showAp ? "90vh" : "100vh" }}
      ></div>
      <div
        className="form-container"
        style={{ height: showAp ? "90vh" : "100vh" }}
      >
        <div className="flex-reset">
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
                            label="Tala"
                            sx={{ mb: 2 }}
                            value={lyricist}
                            onChange={(e) => setLyricist(e.target.value)}
                          />
                        );
                      }}
                    />
                  </Stack>

                  <Stack direction={"row"} spacing={2}>
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
                </ThemeProvider>
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
                    <p
                      style={{
                        margin: 0,
                        padding: 0,
                        fontWeight: 400,
                      }}
                    >
                      Upload image
                    </p>

                    <input
                      type="file"
                      onChange={addImage}
                      name="image_path"
                      hidden
                      multiple
                      accept=".png, .jpg, .jpeg"
                    ></input>
                  </Button>
                )}
                <div className="sub-close">
                  <Button
                    onClick={() => handleClose("close")}
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
}

export default EditForm;

import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  createTheme,
  ThemeProvider,
  Button,
} from "@mui/material";
import axios from "axios";
import AreYouSure from "../../AreYouSure";
import { orange } from "@mui/material/colors";
import { useUrl } from "../../../Hooks/SongProvider";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function SettingsMain({ view, handleError }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [inputValue, setInputValue] = useState(null);
  const [title, setTitle] = useState("");
  const [mappedOptions, setMappedOptions] = useState(null);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [areYouSureContent, setAreYouSure] = useState({});
  const [options, setOptions] = useState(null);
  const [disableDelete, setDisableDelete] = useState(false);

  const URL = useUrl();

  useEffect(() => {
    axios.get(`${URL}/api/master/${view.view_name}`).then((resp) => {
      setOptions(resp.data.content);
    });
  }, []);

  useEffect(() => {
    titler();
    axios.get(`${URL}/api/master/${view.view_name}`).then((resp) => {
      setOptions(resp.data.content);
    });
    setSelectedValue("");
    setInputValue("");
    setSelectedId(null);
    setAreYouSure(null);
  }, [view.view_name]);

  useEffect(() => {
    if (options !== null) {
      optionGenerator();
    }
  }, [options]);

  useEffect(() => {
    if (inputValue !== Object.values(selectedValue).at(-1))
      setDisableDelete(true);
    else setDisableDelete(false);
  }, [inputValue]);

  const optionGenerator = () => {
    if (options !== null) {
      const newOptions = options.map((option) => {
        return (
          <MenuItem key={Object.values(option)[0]} value={option}>
            {Object.values(option).at(-1)}
          </MenuItem>
        );
      });

      setMappedOptions(newOptions);
    }
  };

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    setInputValue(Object.values(e.target.value).at(-1));
    setSelectedId(Object.values(e.target.value).at(0));
  };

  const handleTextChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditOrDelete = (method) => {
    if (
      inputValue === Object.values(selectedValue).at(-1) &&
      method === "edit"
    ) {
      handleError("No changes made.");
      return;
    } else if (inputValue === "" && method === "edit") {
      handleError("Please enter a valid name!");
      return;
    } else if (
      inputValue !== Object.values(selectedValue).at(-1) &&
      method === "edit"
    ) {
      setAreYouSure({ method: method, name: inputValue });
      setShowAreYouSure(true);
    }
    if (
      inputValue === Object.values(selectedValue).at(-1) &&
      method === "delete"
    ) {
      setAreYouSure({ method: method, name: inputValue });
      setShowAreYouSure(true);
    }
  };

  const updateOptions = (values, type) => {
    if (type === "type") {
      setOptions((prev) =>
        prev.map((option) => {
          if (option.song_type === values.song_type) {
            return {
              ...option,
              song_type: values.song_type,
            };
          } else {
            return option;
          }
        })
      );
    }
    if (type === "comoser") {
      setOptions((prev) =>
        prev.map((option) => {
          if (Object.values(option)[0] === values.composer_id) {
            return {
              ...prev,
              composer_name: values.composer_name,
            };
          } else {
            return option;
          }
        })
      );
    }
    if (type === "lyricist") {
      setOptions((prev) =>
        prev.map((option) => {
          if (Object.values(option)[0] === values.lyricist_id) {
            return {
              ...prev,
              lyricist_name: values.lyricist_name,
            };
          } else {
            return option;
          }
        })
      );
    }
    if (type === "tuner") {
      setOptions((prev) =>
        prev.map((option) => {
          if (Object.values(option)[0] === values.tuner_id) {
            return {
              ...prev,
              tuner_name: values.tuner_name,
            };
          } else {
            return option;
          }
        })
      );
    }
    if (type === "raga") {
      setOptions((prev) => {
        prev.map((option) => {
          if (Object.values(option)[0] === values.tuner_id) {
            return {
              ...prev,
              song_raga: values.song_raga,
            };
          }
        });
      });
    }
  };

  const titler = () => {
    if (view.view_name === "type") setTitle("Song type");
    if (view.view_name === "composer") setTitle("Composers");
    if (view.view_name === "lyricist") setTitle("Tala");
    if (view.view_name === "tuner") setTitle("Tuner");
    if (view.view_name === "raga") setTitle("Raga");
  };

  const handleGoAhead = (method) => {
    const body = { id: selectedId, name: inputValue };

    if (method === "delete") {
      axios
        .delete(
          `${URL}/api/master/delete?id=${selectedId}&type=${view.view_name}`
        )
        .then((resp) => {
          if (resp.data.status === "error") {
            handleError(resp.data.message);
            return;
          }
          setOptions((prev) => {
            return prev.filter((option) => {
              if (Object.values(option)[0] !== selectedId) {
                return option;
              }
            });
          });
          setSelectedValue("");
          setInputValue("");
          setSelectedId(null);
          optionGenerator();
          handleError("Successfully deleted.");
        });
    }
    if (method === "edit") {
      axios
        .patch(`${URL}/api/master/edit?table=${view.view_name}`, body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((resp) => {
          if (resp.data.status === "error") {
            handleError(resp.data.message);
            return;
          }
          updateOptions(resp.data.content[0], resp.data.type);
          setSelectedValue("");
          setInputValue("");
          setSelectedId(null);
          optionGenerator();
          handleError("Successfully edited.");
        });
    }
  };

  return (
    <div className="settings-main">
      {showAreYouSure && (
        <AreYouSure
          open={showAreYouSure}
          close={(v) => setShowAreYouSure(v)}
          values={areYouSureContent}
          handleGoAhead={(v) => handleGoAhead(v)}
        />
      )}
      <h3 className="settings-title">{title}</h3>
      <div className="select-form-container">
        <p className="settings-descriptor">Select an option</p>
        <ThemeProvider theme={theme}>
          <TextField
            label={title}
            select
            value={selectedValue}
            onChange={handleChange}
            fullWidth
          >
            <div></div>
            {mappedOptions}
          </TextField>
        </ThemeProvider>
        {selectedValue !== "" && (
          <div className="editor">
            <p className="settings-descriptor">Edit or delete</p>
            <ThemeProvider theme={theme}>
              <TextField
                label="Edit here"
                fullWidth
                value={inputValue}
                autoFocus={true}
                onChange={handleTextChange}
              />
            </ThemeProvider>
            <div className="settings-btns-container">
              <Button
                color="success"
                variant="contained"
                size="small"
                onClick={() => handleEditOrDelete("edit")}
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                size="small"
                onClick={() => handleEditOrDelete("delete")}
                disabled={disableDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsMain;

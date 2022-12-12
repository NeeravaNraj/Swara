import React from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  Autocomplete,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function FormInputAutoComplete({ name, control, label, options, required, size }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, ...field } }) => {
        return (
          <ThemeProvider theme={theme}>
            <Autocomplete
              options={options}
              freeSolo={true}
              fullWidth
              // autoSelect
              onChange={(e, data) => onChange(data)}
              required={required}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    {...field}
                    label={label}
                    inputRef={ref}
                    required={required}
                    sx={{ mb: 2, width: "100%" }}
                    size={size}
                  />
                );
              }}
            />
          </ThemeProvider>
        );
      }}
    />
  );
}

export default FormInputAutoComplete;

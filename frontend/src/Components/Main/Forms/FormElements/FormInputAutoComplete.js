import React from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  Autocomplete,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { fontWeight } from "@mui/system";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function FormInputAutoComplete({
  name,
  control,
  label,
  options,
  required,
  size,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, value, ...field } }) => {
        return (
          <ThemeProvider theme={theme}>
            <Autocomplete
              {...field}
              options={options}
              freeSolo={true}
              fullWidth
              onChange={(_, v) => onChange(v)}
              required={required}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    {...field}
                    label={label}
                    inputRef={ref}
                    onChange={(e) => onChange(e)}
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

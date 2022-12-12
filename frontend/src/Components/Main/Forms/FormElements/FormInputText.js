import React from "react";
import { Controller } from "react-hook-form";
import { TextField, createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function FormInputText({
  name,
  label,
  control,
  multiline,
  rows,
  required,
  focused,
  maxRows,
  size,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => {
        return (
          <ThemeProvider theme={theme}>
            <TextField
              helperText={error ? error.message : null}
              error={!!error}
              label={label}
              onChange={onChange}
              multiline={multiline}
              minRows={rows}
              sx={{ mb: 2 }}
              required={required}
              autoFocus={focused}
              maxRows={maxRows}
              size={size}
            />
          </ThemeProvider>
        );
      }}
    />
  );
}

export default FormInputText;

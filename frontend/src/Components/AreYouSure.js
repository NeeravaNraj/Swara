import React from "react";
import { Modal, Button, createTheme, ThemeProvider } from "@mui/material";
import "../Stylesheets/Areyousure.css";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#0971f1",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

function AreYouSure({ open, close, values, handleGoAhead }) {
  const { method, name } = values;

  const handleGoAheadRuSure = () => {
    handleGoAhead(method)
    close(false)
  }

  return (
    <Modal open={open} onClose={() => close(false)} className="flex-reset">
      <div className="rusure">
        <div className="width-limiter">
          <h3 className="prompt-title">
            Are you sure you want to{" "}
            <span className={method === "edit" ? "edit" : "delete"}>
              {method}
            </span>{" "}
            <span className="tag">"{name}"</span>
          </h3>
        </div>
        <div className="rusure-btns">
          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => close(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={method === "edit" ? "success" : "error"}
              onClick={handleGoAheadRuSure}
            >
              {method}
            </Button>
          </ThemeProvider>
        </div>
      </div>
    </Modal>
  );
}

export default AreYouSure;

import React, { useEffect, useState } from "react";
import "./App.css";
import {
  LinearProgress,
  ThemeProvider,
  createTheme,
  Button,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_FAILURE,
  CHECK_FOR_UPDATE_SUCCESS,
  DOWNLOAD_UPDATE_FAILURE,
  DOWNLOAD_UPDATE_PENDING,
  DOWNLOAD_UPDATE_SUCCESS,
  QUIT_AND_INSTALL_UPDATE,
} from "./Events";
const { ipcRenderer } = window.require("electron");
const remote = window.require("@electron/remote");

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function App() {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
  const [updateFound, setUpdateFound] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [didCheckUpdateFail, setDidCheckUpdateFail] = useState(false);
  const [didDownloadFail, setDidDownloadFail] = useState(false);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [downloadedAmount, setDownloadedAmount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    callCheckForUpdate();

    ipcRenderer.on(CHECK_FOR_UPDATE_SUCCESS, (_, updateInfo) => {
      const version = updateInfo && updateInfo.version;
      const currentAppVersion = remote.app.getVersion();

      if (version && version !== currentAppVersion) {
        console.log("Update found!");
        setIsCheckingForUpdate(false);
        setUpdateFound(true);
      } else {
        console.log("No update found!");
        ipcRenderer.send("noUpdate");
      }
    });
    ipcRenderer.on(CHECK_FOR_UPDATE_FAILURE, () => {
      console.log("Checking for update failed!");
      setDidCheckUpdateFail(true);
    });
    ipcRenderer.on("downloadProgress", (e, prog) => {
      setDownloadProgress(prog.percent);
      setDownloadSpeed(prog.bytesPerSecond);
      setDownloadedAmount(prog.transferred);
      setTotalSize(prog.total);
    });
    ipcRenderer.on(DOWNLOAD_UPDATE_SUCCESS, () => {
      console.log("Download success!");
      setIsUpdateDownloaded(true);
    });
    ipcRenderer.on(DOWNLOAD_UPDATE_FAILURE, () => {
      console.log("Download failed!");
      setDidDownloadFail(true);
      setIsDownloading(false);
    });
  }, []);

  const callCheckForUpdate = () => {
    console.log("Check for updates");
    ipcRenderer.send(CHECK_FOR_UPDATE_PENDING);
    setIsCheckingForUpdate(true);
  };

  const handleDownload = () => {
    console.log("Downloading update!");
    ipcRenderer.send(DOWNLOAD_UPDATE_PENDING);
    setIsDownloading(true);
  };

  const quitAndInstallUpdate = () => {
    console.log("Install update");
    ipcRenderer.send(QUIT_AND_INSTALL_UPDATE);
  };
  return (
    <div className="App">
      <img
        src="https://i.postimg.cc/PrPqsBCj/Sw-ara-transparent.png"
        className="swara-img"
        alt=""
      />
      <div>
        {isCheckingForUpdate && (
          <p className="check">Checking for updates...</p>
        )}
        {isDownloading && (
          <p className="progress-data">
            Downloaded {downloadProgress}% - ({downloadedAmount} / {totalSize})
          </p>
        )}
        {didCheckUpdateFail && (
          <p className="failure">Failed to check for updates!</p>
        )}
        {didDownloadFail && <p className="failure">Download failed!</p>}
      </div>
      <ThemeProvider theme={theme}>
        {isCheckingForUpdate &&
          !updateFound &&
          !didCheckUpdateFail &&
          !didDownloadFail && <LinearProgress className="linear-progress" />}
        {updateFound && (
          <Button
            variant="contained"
            sx={{ color: "white" }}
            onClick={handleDownload}
          >
            Download update
          </Button>
        )}

        {isUpdateDownloaded && (
          <Button
            variant="contained"
            sx={{ color: "white" }}
            onClick={quitAndInstallUpdate}
            color="success"
          >
            Install update
          </Button>
        )}
        {isDownloading && (
          <LinearProgress
            className="linear-progress"
            variant="determinate"
            value={downloadProgress}
          />
        )}
      </ThemeProvider>
      <p className="author-text">Made by Neerava and team.</p>
      <p className="email">Email: neerava.nraj@gmail.com</p>
    </div>
  );
}

export default App;

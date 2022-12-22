const { app, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");
const remote = require("@electron/remote/main");
remote.initialize();
const Events = require("./Events.js");
const { env } = require("process");

autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

let mainWindow;
let splash;

let configurator = path.resolve(__dirname, "preStartConfigurator.js");

const prep = spawn("node", [configurator]);

prep.stdout.on("data", (data) => {
  let server = require(path.join(__dirname, "backend", "build", "app.js"));
  console.log(data.toString());
});

prep.stderr.on("data", (data) => {
  console.log(data.toString());
});

prep.on("exit", (code) => {
  console.log(`Child exited with code ${code}`);
});

const createWindow = () => {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    show: false,
  });

  splash = new BrowserWindow({
    width: Math.round(width * 0.3),
    height: Math.round(height * 0.7),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  remote.enable(splash.webContents);

  if (!isDev) {
    splash.loadFile(
      path.join(__dirname, "splashscreen", "build", "index.html")
    );
    mainWindow.loadFile(
      path.join(__dirname, "frontend", "build", "index.html")
    );
  } else {
    splash.loadURL("http://localhost:3456");
    mainWindow.loadURL("http://localhost:3000");
  }
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// start
ipcMain.on(Events.CHECK_FOR_UPDATE_PENDING, (event) => {
  const { sender } = event;

  // Automatically invoke success on development environment.
  if (isDev) {
    return sender.send(Events.CHECK_FOR_UPDATE_SUCCESS);
  } else {
    const result = autoUpdater.checkForUpdates();

    result
      .then((checkResult) => {
        const { updateInfo } = checkResult;
        return sender.send(Events.CHECK_FOR_UPDATE_SUCCESS, updateInfo);
      })
      .catch(() => {
        return sender.send(Events.CHECK_FOR_UPDATE_FAILURE);
      });
  }
});

ipcMain.on(Events.DOWNLOAD_UPDATE_PENDING, (event) => {
  const result = autoUpdater.downloadUpdate();
  const { sender } = event;

  result
    .then(() => {
      return sender.send(Events.DOWNLOAD_UPDATE_SUCCESS);
    })
    .catch(() => {
      return sender.send(Events.DOWNLOAD_UPDATE_FAILURE);
    });
});

ipcMain.on(Events.QUIT_AND_INSTALL_UPDATE, () => {
  autoUpdater.quitAndInstall(
    false, // isSilent
    true // isForceRunAfter, restart app after update is installed
  );
});

autoUpdater.on("download-progress", (progObj) => {
  return splash.webContents.send("downloadProgress", progObj);
});

ipcMain.on("noUpdate", () => {
  setTimeout(() => {
    splash.close();
    mainWindow.center();
    mainWindow.show();
  }, 1000);
});

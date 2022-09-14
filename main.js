const { app, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");

require("@electron/remote/main").initialize();

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
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  const splash = new BrowserWindow({
    width: 750,
    height: 900,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile(path.join(__dirname, "splashscreen", "build", "index.html"));
  if (!isDev) {
    mainWindow.loadFile(
      path.join(__dirname, "frontend", "build", "index.html")
    );
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      splash.close();
      mainWindow.center();
      mainWindow.show();
    }, 2000);
  });
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

const { app, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");

require("@electron/remote/main").initialize();

const configurator = path.join(__dirname, "preStartConfigurator.js")

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
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (!isDev) {
    win.loadFile(path.join(__dirname, "frontend", "build", "index.html"));
  } else {
    win.loadURL("http://localhost:3000");
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

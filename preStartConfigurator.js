const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const os = require("node:os");
const osType = os.type();

const createDir = (path, shout) => {
  fs.mkdirSync(path, (err) => {
    if (err) throw err;
    else {
      console.log(shout);
    }
  });
};

if (String(osType) === "Windows_NT") {
  const homedir = os.homedir();
  const fullSwaraWinStoragePath = path.join(
    String(homedir),
    "AppData",
    "Roaming",
    "SwaraFiles"
  );
  const dirExists = fs.existsSync(fullSwaraWinStoragePath);
  if (!dirExists) {
    createDir(fullSwaraWinStoragePath, "Made SwaraFiles");
    createDir(
      path.join(fullSwaraWinStoragePath, "AudioFiles"),
      "Made AudioFiles"
    );
    createDir(path.join(fullSwaraWinStoragePath, "db"), "Made db");
    createDir(
      path.join(fullSwaraWinStoragePath, "ImageFiles"),
      "Made ImageFiles"
    );
  }
  if (dirExists) {
    const checkInSwaraAudioFiles = fs.existsSync(
      path.join(String(fullSwaraWinStoragePath), "AudioFiles")
    );
    const checkInSwaraDBFile = fs.existsSync(
      path.join(String(fullSwaraWinStoragePath), "db")
    );

    const checkInSwaraImageFiles = fs.existsSync(
      path.join(String(fullSwaraWinStoragePath), "ImageFiles")
    );

    if (
      checkInSwaraAudioFiles &&
      checkInSwaraDBFile &&
      checkInSwaraImageFiles
    ) {
      console.log("Files already exist, Cheers!");
      return;
    } else if (!checkInSwaraAudioFiles) {
      createDir(
        path.join(String(fullSwaraWinStoragePath), "AudioFiles"),
        "Made AudioFiles"
      );
    } else if (!checkInSwaraDBFile) {
      createDir(path.join(String(fullSwaraWinStoragePath), "db"), "Made db");
    } else if (!checkInSwaraImageFiles) {
      createDir(
        path.join(String(fullSwaraWinStoragePath), "ImageFiles"),
        "Made ImageFiles"
      );
    }
  }
}

if (String(osType) === "Linux") {
  const homedir = os.homedir();
  const fullSwaraLinuxStoragePath = path.join(String(homedir), ".SwaraFiles");
  const dirExists = fs.existsSync(fullSwaraLinuxStoragePath);
  if (!dirExists) {
    createDir(fullSwaraLinuxStoragePath, "Made SwaraFiles");
    createDir(
      path.join(fullSwaraLinuxStoragePath, "AudioFiles"),
      "Made AudioFiles"
    );
    createDir(path.join(fullSwaraLinuxStoragePath, "db"), "Made db");
    createDir(
      path.join(fullSwaraLinuxStoragePath, "ImageFiles"),
      "Made ImageFiles"
    );
  }
  if (dirExists) {
    const checkInSwaraAudioFiles = fs.existsSync(
      path.join(String(fullSwaraLinuxStoragePath), "AudioFiles")
    );
    const checkInSwaraDBFile = fs.existsSync(
      path.join(String(fullSwaraLinuxStoragePath), "db")
    );

    const checkInSwaraImageFiles = fs.existsSync(
      path.join(String(fullSwaraLinuxStoragePath), "ImageFiles")
    );

    if (checkInSwaraAudioFiles && checkInSwaraDBFile === true) {
      console.log("Files already exist, Cheers!");
      return;
    } else if (!checkInSwaraAudioFiles) {
      createDir(
        path.join(fullSwaraLinuxStoragePath, "AudioFiles"),
        "Made AudioFiles"
      );
    } else if (!checkInSwaraDBFile) {
      createDir(path.join(fullSwaraLinuxStoragePath, "db"), "Made db");
    } else if (!checkInSwaraImageFiles) {
      createDir(
        path.join(fullSwaraLinuxStoragePath, "ImageFiles"),
        "Made ImageFiles"
      );
    }
  }
}
if (String(osType) === "Darwin") {
  const homedir = os.homedir();
  const fullSwaraMacStoragePath = path.join(String(homedir), ".SwaraFiles");
  const dirExists = fs.existsSync(fullSwaraMacStoragePath);
  if (!dirExists) {
    createDir(fullSwaraMacStoragePath, "Made SwaraFiles");
    createDir(
      path.join(fullSwaraMacStoragePath, "AudioFiles"),
      "Made AudioFiles"
    );
    createDir(path.join(fullSwaraMacStoragePath, "db"), "Made db");
    createDir(
      path.join(fullSwaraMacStoragePath, "ImageFiles"),
      "Made ImageFiles"
    );
  }
  if (dirExists) {
    const checkInSwaraAudioFiles = fs.existsSync(
      path.join(String(fullSwaraMacStoragePath), "AudioFiles")
    );
    const checkInSwaraDBFile = fs.existsSync(
      path.join(String(fullSwaraMacStoragePath), "db")
    );

    const checkInSwaraImageFiles = fs.existsSync(
      path.join(String(fullSwaraMacStoragePath), "ImageFiles")
    );

    if (checkInSwaraAudioFiles && checkInSwaraDBFile === true) {
      console.log("Files already exist, Cheers!");
      return;
    } else if (!checkInSwaraAudioFiles) {
      createDir(
        path.join(fullSwaraMacStoragePath, "AudioFiles"),
        "Made AudioFiles"
      );
    } else if (!checkInSwaraDBFile) {
      createDir(path.join(fullSwaraMacStoragePath, "db"), "Made db");
    } else if (!checkInSwaraImageFiles) {
      createDir(
        path.join(fullSwaraMacStoragePath, "ImageFiles"),
        "Made ImageFiles"
      );
    }
  }
}

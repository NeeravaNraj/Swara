const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const os = require("node:os");
const osType = os.type();

if (String(osType) === "Windows_NT") {
  const homedir = os.homedir();
  const fullWinAudioStoragePath = path.join(
    String(homedir),
    "AppData",
    "Roaming",
    "SwaraFiles"
  );
  const dirExists = fs.existsSync(fullWinAudioStoragePath);
  if (!dirExists) {
    fs.mkdir(String(fullWinAudioStoragePath), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made SwaraFiles");
      }
    });

    fs.mkdir(
      path.join(String(fullWinAudioStoragePath), "AudioFiles"),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made AudioFiles");
        }
      }
    );

    fs.mkdir(path.join(String(fullWinAudioStoragePath), "db"), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made db");
      }
    });
  }
  if (dirExists) {
    const checkInSwaraAudioFiles = fs.existsSync(
      path.join(String(fullWinAudioStoragePath), "AudioFiles")
    );
    const checkInSwaraDBFile = fs.existsSync(
      path.join(String(fullWinAudioStoragePath), "db")
    );

    if (checkInSwaraAudioFiles && checkInSwaraDBFile === true) {
      console.log("Files already exist, Cheers!");
      return;
    } else if (!checkInSwaraAudioFiles) {
      fs.mkdir(
        path.join(String(fullWinAudioStoragePath), "AudioFiles"),
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Made AudioFiles");
          }
        }
      );
    } else if (!checkInSwaraDBFile) {
      fs.mkdir(path.join(String(fullWinAudioStoragePath), "db"), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made db");
        }
      });
    }
  }
}

if (String(osType) === "Linux") {
  const homedir = os.homedir();
  const fullLinuxStoragePath = path.join(String(homedir), ".SwaraFiles");
  const dirExists = fs.existsSync(fullLinuxStoragePath);
  if (!dirExists) {
    fs.mkdir(String(fullLinuxStoragePath), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made SwaraFiles");
      }
    });

    fs.mkdir(path.join(String(fullLinuxStoragePath), "AudioFiles"), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made AudioFiles");
      }
    });

    fs.mkdir(path.join(String(fullLinuxStoragePath), "db"), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made db");
      }
    });
  }
  if (dirExists) {
    const checkInSwaraAudioFiles = fs.existsSync(
      path.join(String(fullLinuxStoragePath), "AudioFiles")
    );
    const checkInSwaraDBFile = fs.existsSync(
      path.join(String(fullLinuxStoragePath), "db")
    );

    if (checkInSwaraAudioFiles && checkInSwaraDBFile === true) {
      console.log("Files already exist, Cheers!");
      return;
    } else if (!checkInSwaraAudioFiles) {
      fs.mkdir(path.join(String(fullLinuxStoragePath), "AudioFiles"), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made AudioFiles");
        }
      });
    } else if (!checkInSwaraDBFile) {
      fs.mkdir(path.join(String(fullLinuxStoragePath), "db"), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made db");
        }
      });
    }
  }
}
if (String(osType) === "Darwin") {
}

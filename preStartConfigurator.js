const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const os = require("node:os");
const osType = os.type();

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
    fs.mkdir(String(fullSwaraWinStoragePath), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made SwaraFiles");
      }
    });

    fs.mkdir(
      path.join(String(fullSwaraWinStoragePath), "AudioFiles"),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made AudioFiles");
        }
      }
    );

    fs.mkdir(path.join(String(fullSwaraWinStoragePath), "db"), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made db");
      }
    });

    fs.mkdir(
      path.join(String(fullSwaraWinStoragePath), "ImageFiles"),
      (err) => {
        if (err) console.log(err);
        else console.log("Made ImageFiles");
      }
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
      fs.mkdir(
        path.join(String(fullSwaraWinStoragePath), "AudioFiles"),
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Made AudioFiles");
          }
        }
      );
    } else if (!checkInSwaraDBFile) {
      fs.mkdir(path.join(String(fullSwaraWinStoragePath), "db"), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made db");
        }
      });
    } else if (!checkInSwaraImageFiles) {
      fs.mkdir(
        path.join(String(fullSwaraWinStoragePath), "ImageFiles"),
        (err) => {
          if (err) console.log(err);
          else console.log("Made ImageFiles");
        }
      );
    }
  }
}

if (String(osType) === "Linux") {
  const homedir = os.homedir();
  const fullSwaraLinuxStoragePath = path.join(String(homedir), ".SwaraFiles");
  const dirExists = fs.existsSync(fullSwaraLinuxStoragePath);
  if (!dirExists) {
    fs.mkdir(String(fullSwaraLinuxStoragePath), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made SwaraFiles");
      }
    });

    fs.mkdir(
      path.join(String(fullSwaraLinuxStoragePath), "AudioFiles"),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made AudioFiles");
        }
      }
    );

    fs.mkdir(path.join(String(fullSwaraLinuxStoragePath), "db"), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Made db");
      }
    });

    fs.mkdir(path.join(fullSwaraLinuxStoragePath), "ImageFiles", (err) => {
      if (err) console.log(err);
      else console.log("Made ImageFiles");
    });
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
      fs.mkdir(
        path.join(String(fullSwaraLinuxStoragePath), "AudioFiles"),
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Made AudioFiles");
          }
        }
      );
    } else if (!checkInSwaraDBFile) {
      fs.mkdir(path.join(String(fullSwaraLinuxStoragePath), "db"), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Made db");
        }
      });
    } else if (!checkInSwaraImageFiles) {
      fs.mkdir(path.join(fullSwaraLinuxStoragePath), "ImageFiles", (err) => {
        if (err) console.log(err);
        else console.log("Made ImageFiles");
      });
    }
  }
}
if (String(osType) === "Darwin") {
}

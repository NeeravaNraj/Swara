(function () {
  const express = require("express");
  const model = require("./models/model");
  const config = require("./knexfile");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  const os = require("node:os");

  const port = 5000;

  const osType = os.type();
  let fullAudioStoragePath;
  let fullImageStoragePath;
  let imageParentFolder;
  if (String(osType) === "Windows_NT") {
    const homedir = os.homedir();
    fullAudioStoragePath = path.join(
      String(homedir),
      "AppData",
      "Roaming",
      "SwaraFiles",
      "AudioFiles"
    );
    fullImageStoragePath = path.join(
      String(homedir),
      "AppData",
      "Roaming",
      "SwaraFiles",
      "ImageFiles"
    );
  }
  if (String(osType) === "Linux") {
    const homedir = os.homedir();
    fullAudioStoragePath = path.join(
      String(homedir),
      ".SwaraFiles",
      "AudioFiles"
    );
    fullImageStoragePath = path.join(
      String(homedir),
      ".SwaraFiles",
      "ImageFiles"
    );
  }
  if (String(osType) === "Darwin") {
    const homedir = os.homedir();
    fullAudioStoragePath = path.join(
      String(homedir),
      ".SwaraFiles",
      "AudioFiles"
    );
    fullImageStoragePath = path.join(
      String(homedir),
      ".SwaraFiles",
      "ImageFiles"
    );
  }

  const app = express();

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.split("/")[0] === "audio")
        cb(null, fullAudioStoragePath);
      else if (file.mimetype.split("/")[0] === "image") {
        let id = req.body.id;
        const imgPath = path.join(fullImageStoragePath, id);
        try {
          fs.mkdirSync(imgPath);
        } catch (err) {}
        cb(null, imgPath);
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, callback) => {
      let ext = path.extname(file.originalname);
      if (
        ext !== ".mp3" &&
        ext !== ".wav" &&
        ext !== ".ogg" &&
        ext !== ".m4a" &&
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".jpeg"
      ) {
        return callback(new Error("Only audio files allowed."));
      }
      // console.log("test")
      callback(null, true);
    },
  });

  const urlencodedParser = bodyParser.urlencoded({ extended: false });
  const jsonParser = bodyParser.json();
  const uploadFields = upload.fields([
    { name: "song_path", maxCount: 1 },
    { name: "image_path", maxCount: 10 },
  ]);

  app.use(cors());
  app.use(express.json());
  app.use(urlencodedParser);

  //get all
  app.get("/api/songs", async (req, res) => {
    const { page } = req.query;

    const returnRes = async () => {
      const results = await model.all(page);
      if (Number(page) > 1) {
        return res.status(200).json({ message: "ok", content: results });
      }
      if (Number(page) === 1) {
        return res.status(200).json({
          message: "ok",
          content: {
            songs: results.songs,
            max_pages: results.maxpages,
            numOfSongs: results.numOfSongs,
          },
        });
      }
    };
    try {
      await returnRes();
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  app.get("/api/stream/:id", (req, res) => {
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires range header");
    }

    const { id } = req.params;

    const audioPath = model
      .getParticular(id)
      .then((res) => res[0])
      .then((path) => {
        return path;
      });

    const getPath = async () => {
      const a = await audioPath;
      try {
        return String(path.join(fullAudioStoragePath, String(a.song_path)));
      } catch (err) {
        res.status(500).json({ message: err });
      }
    };

    const stream = async () => {
      const file = await getPath();
      try {
        const audioSize = fs.statSync(String(file)).size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, Number(audioSize) - 1);
        const contentLength = end - start + 1;
        const header = {
          "Content-Range": `bytes ${start}-${end}/${audioSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "audio/mpeg",
        };

        res.writeHead(206, header);

        const audioStream = fs.createReadStream(file, { start, end });

        audioStream.pipe(res);
      } catch (err) {
        if (err.errno === -4058)
          res
            .status(404)
            .json({ errno: err.errno, errMsg: "Song file not found" });
        console.log(err);
        return;
      }
    };
    if (id !== "") {
      stream();
    }
  });

  app.get("/api/imageStream/:id/:imageNum", async (req, res) => {
    const { id, imageNum } = req.params;
    if (!id) res.status(400).send("Require song id!");
    if (!imageNum) res.status(400).send("Require image number!");

    const imagePath = await model.getImagePath(id, imageNum);

    if (imagePath.length === 0)
      res.status(404).send("There is no image for this song.");
    try {
      let fullpath = path.join(fullImageStoragePath, imagePath[0].image_path);
      const imageSize = fs.statSync(String(fullpath)).size;
      const CHUNK_SIZE = 10 ** 10;
      const start = 0;
      const end = Math.min(start + CHUNK_SIZE, Number(imageSize) - 1);
      const contentLength = end - start + 1;
      const header = {
        "Content-Range": `bytes ${start}-${end}/${imageSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "image/jpg",
      };

      res.writeHead(206, header);

      const imageStream = fs.createReadStream(String(fullpath), { start, end });

      imageStream.pipe(res);
    } catch (err) {
      console.log(err);
      return;
    }
  });

  // returns the number of images of a particular song
  app.get("/api/imageCheck/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) res.status(400).send("Provide song id please!");
    const hasImages = await model.checkImages(id);

    res.status(200).json({ count: hasImages });
  });

  // returns all images entries of a particular song
  app.get("/api/images/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const images = await model.getImageData(id);
      res.status(200).json({ code: 200, images: images });
    } catch (err) {
      res.status(400).json({ code: 404, msg: "Internal server error." });
    }
  });

  // store images temporarily while editing
  app.post(
    "/api/temp/store",
    upload.array("temp_imgs", 10),
    async (req, res) => {
      try {
        await model.addTempFiles(req);
        res.status(200).json({ code: 200, msg: "Saved temp files" });
      } catch (err) {
        res.status(400).json({ code: 404, msg: "Internal server error." });
      }
    }
  );

  // remove temp images
  app.post("/api/temp/remove", async (req, res) => {
    const { id, start } = req.body;

    try {
      if (String(start) !== "null") {
        const paths = await model.getImageData(id);
        for (let i = start; i < paths.length; ++i) {
          fs.unlink(
            path.join(fullImageStoragePath, paths[i].image_path),
            (err) => {
              if (err) console.log(err);
            }
          );
        }
        await model.clearTemps(id, start);
      }
      res.status(200).json({ code: 200, msg: "Temps are cleared." });
    } catch (err) {
      console.log(err);
      res.status(400).json({ code: 404, msg: "Internal server error." });
    }
  });

  //get by id
  app.get("/api/songs/:id", (req, res) => {
    const { id } = req.params;
    model
      .getParticular(id)
      .then((song) => {
        res.status(200).json(song);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  });

  //insert into songs table record
  app.post("/api/songs", uploadFields, async (req, res) => {
    const { id } = req.body;

    const returnRecord = async () => {
      await model.addSong(req);
      const data = await model.getParticular(id);
      return res.status(200).json({ message: "ok", data: data });
    };

    try {
      returnRecord();
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  //delete record by id
  app.delete("/api/songs/:id", (req, res) => {
    const { id } = req.params;
    const audioPath = model
      .getParticular(id)
      .then((res) => res[0])
      .then((path) => {
        return path;
      });

    const getPath = async () => {
      try {
        const a = await audioPath;
        const p = path.join(fullAudioStoragePath, String(a.song_path));
        return String(p);
      } catch (err) {
        if (err) {
          return;
        }
      }
    };

    const deleteFileRecord = async () => {
      const file = await getPath();
      const hasImages = await model.checkImages(id);
      let images;
      try {
        try {
          fs.unlink(file, (err) => {
            if (err) console.log(err);
          });
          images = await model.getImageData(id);
          if (hasImages > 0) {
            for (const image of images) {
              fs.unlink(
                path.join(fullImageStoragePath, image.image_path),
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
            fs.rmdir(path.join(fullImageStoragePath, id), (err) => {
              if (err) console.log(err);
            });
          }
          model.del(req.params.id);
        } catch (err) {
          console.log(err);
        }
        res.status(200).json({
          message: `Record with id ${req.params.id} has been removed`,
        });
      } catch (err) {
        res.status(500).json({ message: `Unsuccessful ${err}` });
      }
    };
    deleteFileRecord();
  });

  //update by id
  app.patch("/api/songs/:id", jsonParser, async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSong = await model.preUpdateChecks(id, req.body);
      res.status(200).json({
        message: `Updated record with id ${id}`,
        content: updatedSong,
      });
    } catch (err) {
      res.status(500).json({ message: `Unsuccessful ${err}` });
    }
  });

  app.get("/api/search-data", async (req, res) => {
    const results = await model.getSearchData();
    try {
      res.status(200).json({ message: "ok", content: results });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.get("/api/playlist", (req, res) => {
    try {
      model.getAllFromPlaylist().then((data) => res.status(200).json(data));
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.patch("/api/playlist/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const updateData = await model.updatePlaylist(id, req.body);
      res.status(200).json({
        message: "ok",
        content: updateData.data,
      });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.post("/api/playlist", async (req, res) => {
    const { playlist_id, playlist_name } = req.body;
    const returnRecord = async () => {
      model.insertIntoPlaylist(playlist_id, playlist_name);
      const data = await model.getParticularPlaylist(playlist_id);
      return res.status(200).json({ message: "ok", content: data });
    };

    try {
      returnRecord();
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.get("/api/playlist/:id", async (req, res) => {
    const { id } = req.params;
    const { page } = req.query;

    const returnPlSongs = async () => {
      const songs = await model.getPlaylistSongs(id, page);
      return res.status(200).json({ message: "ok", content: songs });
    };

    const returnOnlySongs = async () => {
      const songs = await model.getAllSongsOnly(page);
      return res.status(200).json({ message: "ok", content: songs });
    };

    try {
      Number(id) === 0 ? returnOnlySongs() : returnPlSongs();
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.delete("/api/playlist/:id", (req, res) => {
    const { id } = req.params;
    try {
      model.deletePlaylist(id);
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.post("/api/song-playlist", async (req, res) => {
    const { song_id, playlist_id } = req.body;
    try {
      const data = await model.getParticular(song_id);
      const song = await model.addToSongPlaylist(song_id, playlist_id);
      if (song.message) {
        res.status(200).json({ message: "ok", content: data });
      } else if (song.err) {
        res.status(200).json({ err: song.err });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.delete("/api/song-playlist/song/:id", async (req, res) => {
    const { id } = req.params;

    try {
      model.delSongFromSongPlaylist(id);
      res.status(200).json({ message: "ok" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.get("/api/search", async (req, res) => {
    const { query, field, page } = req.query;
    const results = await model.searchFromDatabase(field, query, page);
    try {
      res.status(200).json({ message: "ok", content: results });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.get("/api/master/:type", async (req, res) => {
    const { type } = req.params;
    const data = await model.getMasterContent(String(type));
    try {
      res.status(200).json({ message: "ok", content: data });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.patch("/api/master/edit", async (req, res) => {
    const { table } = req.query;
    const changes = req.body;

    try {
      const data = await model.updateMasterContent(String(table), changes);
      res.status(200).json({ message: "ok", content: data, type: table });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.delete("/api/master/delete", async (req, res) => {
    const { id, type } = req.query;
    try {
      await model.deleteMasterContent(String(type), String(id));
      res.status(200).json({ message: "ok" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.get("/download/song/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const getPath = async () => {
        const fileName = await model.getParticular(id);
        const filePath = path.join(
          fullAudioStoragePath,
          String(fileName[0].song_path)
        );
        const filename =
          fileName[0].song_name + "." + fileName[0].song_path.split(".").at(-1);
        return { getFile: filePath, name: filename };
      };

      const { getFile, name } = await getPath();

      res.download(getFile, name);
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  });

  app.listen(port, () => {
    console.log("Listening on port:", port);
  });
  module.exports = app;
})();

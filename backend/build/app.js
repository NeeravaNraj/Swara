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

  const osType = os.type();

  let fullAudioStoragePath;
  if (String(osType) === "Windows_NT") {
    const homedir = os.homedir();
    fullAudioStoragePath = path.join(
      String(homedir),
      "AppData",
      "Roaming",
      "SwaraFiles",
      "AudioFiles"
    );
  }
  if (String(osType) === "Linux") {
    const homedir = os.homedir();
    fullAudioStoragePath = path.join(
      String(homedir),
      ".SwaraFiles",
      "AudioFiles"
    );
  }
  if (String(osType) === "Darwin") {
  }

  const app = express();

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullAudioStoragePath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, callback) => {
      let ext = path.extname(file.originalname);
      if (ext !== ".mp3" && ext !== ".wav" && ext !== ".ogg") {
        return callback(new Error("Only audio files allowed."));
      }
      callback(null, true);
    },
  });

  const urlencodedParser = bodyParser.urlencoded({ extended: false });
  const jsonParser = bodyParser.json();
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

    const getSize = async () => {
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
        console.log(err);
      }
    };
    getSize();
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
  app.post("/api/songs", upload.single("song_path"), async (req, res) => {
    const route = fullAudioStoragePath;

    const { id } = req.body;

    const returnRecord = async () => {
      await model.addSong(req, route);
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
      try {
        model.del(req.params.id);
        fs.unlink(file, (err) => {
          if (err) throw err;
        });
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

  app.listen(5000);
  module.exports = app;
})();
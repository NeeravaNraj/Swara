const sqlite3 = require("sqlite3");
const knex = require("knex");
const path = require("path");
const config = require("../knexfile");
const { getAudioDurationInSeconds } = require("get-audio-duration");
const os = require("node:os");

const osType = os.type();

let fullDBStoragePath;

if (String(osType) === "Windows_NT") {
  const homedir = os.homedir();
  fullDBStoragePath = path.join(
    String(homedir),
    "AppData",
    "Roaming",
    "SwaraFiles",
    "db",
    "data.db"
  );
}
if (String(osType) === "Linux") {
  const homedir = os.homedir();
  fullDBStoragePath = path.join(
    String(homedir),
    ".SwaraFiles",
    "db",
    "data.db"
  );
}
if (String(osType) === "Darwin") {
}

const sqlite = new sqlite3.Database(fullDBStoragePath);

const db = knex(config);

(async () => {
  try {
    const migrate = async () => db.migrate.latest();
    await migrate();
    seed();
  } catch (ex) {
    console.log("Error migrating: ", ex);
  }
})();

const seed = async () => {
  try{
    await db.seed.run();
  }catch(err){
    return
  }
};

const getDuration = async (route) => {
  const duration = await getAudioDurationInSeconds(route);
  return duration;
};

const checkIfExistsAndInserts = async (recordToCheck) => {
  var type = recordToCheck.type;
  var tableName = recordToCheck.tableName;
  var value = recordToCheck.value;
  if (type === "composer") {
    const record = await db(tableName)
      .count()
      .whereRaw(`LOWER(composer_name) = ?`, [value.toLowerCase()]);
    if (Object.values(record[0])[0] === 0) {
      await db(tableName).insert({
        composer_name: value,
      });
    }
  }

  if (type === "lyricist") {
    const record = await db(tableName)
      .count()
      .whereRaw(`LOWER(lyricist_name) = ?`, [value.toLowerCase()]);
    if (Object.values(record[0])[0] === 0) {
      await db(tableName).insert({
        lyricist_name: value,
      });
    }
  }
  if (type === "tuner") {
    const record = await db(tableName)
      .count()
      .whereRaw(`LOWER(tuner_name) = ?`, [value.toLowerCase()]);
    if (Object.values(record[0])[0] === 0) {
      await db(tableName).insert({
        tuner_name: value,
      });
    }
  }
  if (type === "raga") {
    const record = await db(tableName)
      .count()
      .whereRaw(`LOWER(song_raga) = ?`, [value.toLowerCase()]);
    if (Object.values(record[0])[0] === 0) {
      await db(tableName).insert({
        song_raga: value,
      });
    }
  }
  if (type === "type") {
    const record = await db(tableName)
      .count()
      .whereRaw(`LOWER(song_type) = ?`, [value.toLowerCase()]);
    if (Object.values(record[0])[0] === 0) {
      await db(tableName).insert({
        song_type: value,
      });
    }
  }
};

const createObject = (person, type) => {
  const protoObj = {
    value: "value",
    tableName: "value",
    columnName: "value",
    type: "value",
  };

  if (type === "composer") {
    const composer_obj = Object.create(protoObj);
    composer_obj.value = person;
    composer_obj.tableName = "composer_table";
    composer_obj.columnName = "composer_name";
    composer_obj.type = "composer";
    return composer_obj;
  }
  if (type === "lyricist") {
    const lyricist_obj = Object.create(protoObj);
    lyricist_obj.value = person;
    lyricist_obj.tableName = "lyricist_table";
    lyricist_obj.columnName = "lyricist_name";
    lyricist_obj.type = "lyricist";
    return lyricist_obj;
  }
  if (type === "tuner") {
    const tuner_obj = Object.create(protoObj);
    tuner_obj.value = person;
    tuner_obj.tableName = "tuner_table";
    tuner_obj.columnName = "tuner_name";
    tuner_obj.type = "tuner";
    return tuner_obj;
  }
  if (type === "raga") {
    const raga_obj = Object.create(protoObj);
    raga_obj.value = person;
    raga_obj.tableName = "song_raga_table";
    raga_obj.columnName = "song_raga";
    raga_obj.type = "raga";
    return raga_obj;
  }
  if (type === "type") {
    const type_obj = Object.create(protoObj);
    type_obj.value = person;
    type_obj.tableName = "song_type_table";
    type_obj.columnName = "song_type";
    type_obj.type = "type";
    return type_obj;
  }
};

const getIds = async (comp, lyr, tune, raga, type) => {
  let comp_id;
  let lyr_id;
  let tune_id;
  let raga_id;
  let type_id;

  if (comp) {
    comp_id = await db("composer_table")
      .select("composer_id")
      .whereRaw("LOWER(composer_name) = ?", comp.toLowerCase());
  }
  if (lyr) {
    lyr_id = await db("lyricist_table")
      .select("lyricist_id")
      .whereRaw("LOWER(lyricist_name) = ?", lyr.toLowerCase());
  }
  if (tune) {
    tune_id = await db("tuner_table")
      .select("tuner_id")
      .whereRaw("LOWER(tuner_name) = ?", tune.toLowerCase());
  }
  if (raga) {
    raga_id = await db("song_raga_table")
      .select("raga_id")
      .whereRaw("LOWER(song_raga) = ?", raga.toLowerCase());
  }
  if (type) {
    type_id = await db("song_type_table")
      .select("song_type_id")
      .whereRaw("LOWER(song_type) = ?", type.toLowerCase());
  }

  if (comp_id === undefined) {
    comp_id = await db("composer_table")
      .select("composer_id")
      .whereRaw("LOWER(composer_name) = ?", "unknown");
  } else if (comp_id !== undefined) {
    comp_id;
  }
  if (lyr_id === undefined) {
    lyr_id = await db("lyricist_table")
      .select("lyricist_id")
      .whereRaw("LOWER(lyricist_name) = ?", "unknown");
  } else if (lyr_id !== undefined) {
    lyr_id;
  }
  if (tune_id === undefined) {
    tune_id = await db("tuner_table")
      .select("tuner_id")
      .whereRaw("LOWER(tuner_name) = ?", "unknown");
  } else if (tune_id !== undefined) {
    tune_id;
  }

  return {
    composer_id: Object.values(comp_id[0])[0],
    lyricist_id: Object.values(lyr_id[0])[0],
    tuner_id: Object.values(tune_id[0])[0],
    raga_id: Object.values(raga_id[0])[0],
    type_id: Object.values(type_id[0])[0],
  };
};

const addSong = async (sentReq, route) => {
  const file = String(path.join(route, sentReq.file.filename));
  const {
    id,
    song_name,
    raga,
    song_type,
    tuned_by,
    composer,
    lyrics,
    lyricist,
  } = sentReq.body;
  const duration = await getDuration(file);

  const compObj = createObject(composer, "composer");
  const lyrObj = createObject(lyricist, "lyricist");
  const tunerObj = createObject(tuned_by, "tuner");
  const ragaObj = createObject(raga, "raga");
  const typeObj = createObject(song_type, "type");

  await checkIfExistsAndInserts(compObj);
  await checkIfExistsAndInserts(lyrObj);
  await checkIfExistsAndInserts(tunerObj);
  await checkIfExistsAndInserts(ragaObj);
  await checkIfExistsAndInserts(typeObj);
  const { composer_id, lyricist_id, tuner_id, raga_id, type_id } = await getIds(
    composer,
    lyricist,
    tuned_by,
    raga,
    song_type
  );

  const proto = {
    song_id: id,
    song_name: song_name,
    raga_id: raga_id,
    song_type_id: type_id,
    tuner_id: tuner_id,
    composer_id: composer_id,
    song_lyrics: lyrics,
    lyricist_id: lyricist_id,
    song_path: sentReq.file.filename,
    song_duration: duration,
  };
  insertIntoSongsTable(proto);
};

const insertIntoSongsTable = async (record) => {
  await db("songs_table").insert(record);
};

const all = async (page) => {
  const songsall = await db("songs_table")
    .select("*")
    .leftJoin(
      "composer_table",
      "composer_table.composer_id",
      "songs_table.composer_id"
    )
    .leftJoin(
      "lyricist_table",
      "lyricist_table.lyricist_id",
      "songs_table.lyricist_id"
    )
    .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
    .leftJoin(
      "song_raga_table",
      "song_raga_table.raga_id",
      "songs_table.raga_id"
    )
    .leftJoin(
      "song_type_table",
      "song_type_table.song_type_id",
      "songs_table.song_type_id"
    )
    .limit(10)
    .offset(page * 10 - 10);

  const playlists = await db("playlist_table").select("*");
  const num = await db("songs_table").count();

  const all = {
    songs: songsall,
    playlists: playlists,
    maxpages: Math.ceil(Object.values(num[0])[0] / 10 + 1),
    numOfSongs: Object.values(num[0])[0],
  };
  if (all.songs[0] !== undefined) {
    return all;
  }
};

const preUpdateChecks = async (song_id, sentReq) => {
  const {
    song_name,
    song_raga,
    song_type,
    tuned_by,
    composer_name,
    song_lyrics,
    lyricist_name,
  } = sentReq;

  const compObj = createObject(composer_name, "composer");
  const lyrObj = createObject(lyricist_name, "lyricist");
  const tunerObj = createObject(tuned_by, "tuner");
  const ragaObj = createObject(song_raga, "raga");
  const typeObj = createObject(song_type, "type");

  await checkIfExistsAndInserts(compObj);
  await checkIfExistsAndInserts(lyrObj);
  await checkIfExistsAndInserts(tunerObj);
  await checkIfExistsAndInserts(ragaObj);
  await checkIfExistsAndInserts(typeObj);

  const { composer_id, lyricist_id, tuner_id, raga_id, type_id } = await getIds(
    composer_name,
    lyricist_name,
    tuned_by,
    song_raga,
    song_type
  );

  const proto = {
    song_name: song_name,
    raga_id: raga_id,
    song_type_id: type_id,
    tuner_id: tuner_id,
    composer_id: composer_id,
    song_lyrics: song_lyrics,
    lyricist_id: lyricist_id,
  };

  update(song_id, proto);
  return await getParticular(song_id);
};

const getAllSongsOnly = async (page) => {
  const pageNum = Number(page * 10 - 10);
  const songs = await db("songs_table")
    .select("*")
    .leftJoin(
      "composer_table",
      "composer_table.composer_id",
      "songs_table.composer_id"
    )
    .leftJoin(
      "lyricist_table",
      "lyricist_table.lyricist_id",
      "songs_table.lyricist_id"
    )
    .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
    .leftJoin(
      "song_raga_table",
      "song_raga_table.raga_id",
      "songs_table.raga_id"
    )
    .leftJoin(
      "song_type_table",
      "song_type_table.song_type_id",
      "songs_table.song_type_id"
    )
    .limit(10)
    .offset(pageNum);

  const num = await db("songs_table").count();
  return { songs: songs, numOfSongs: Object.values(num[0])[0] };
};

const getParticular = async (id) => {
  return await db("songs_table")
    .select("*")
    .where({ song_id: id })
    .leftJoin(
      "composer_table",
      "composer_table.composer_id",
      "songs_table.composer_id"
    )
    .leftJoin(
      "lyricist_table",
      "lyricist_table.lyricist_id",
      "songs_table.lyricist_id"
    )
    .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
    .leftJoin(
      "song_raga_table",
      "song_raga_table.raga_id",
      "songs_table.raga_id"
    )
    .leftJoin(
      "song_type_table",
      "song_type_table.song_type_id",
      "songs_table.song_type_id"
    );
};

const update = async (id, changes) => {
  await db("songs_table").where({ song_id: id }).update(changes);
};

const del = async (id) => {
  await db("song_playlist_table").where({ song_id: id }).del();
  await db("songs_table").where({ song_id: id }).del();
};

const getAllFromPlaylist = async () => {
  return await db("playlist_table").select("*");
};

const getParticularPlaylist = async (id) => {
  return await db("playlist_table").select("*").where({ playlist_id: id });
};

const preInsertCheckSongPlaylist = async (playlistId, songId) => {
  const rec = await db("song_playlist_table")
    .whereRaw(`song_id = ? AND playlist_id = ?`, [songId, playlistId])
    .count();
  return Object.values(rec[0])[0];
};

const insertIntoPlaylist = async (playlistId, playlistName) => {
  try {
    await db("playlist_table").insert({
      playlist_id: playlistId,
      playlist_name: playlistName,
    });
  } catch (err) {
    return err;
  }
};

const updatePlaylist = async (id, changes) => {
  const { playlist_name } = changes;
  try {
    await db("playlist_table")
      .where({ playlist_id: id })
      .update({ playlist_name: playlist_name });
  } catch (err) {
    if (err) {
      return err;
    }
  }
  return {
    message: "Updated playlist name",
    data: { playlist_id: id, playlist_name: playlist_name },
  };
};

const deletePlaylist = async (id) => {
  await db("song_playlist_table").where({ playlist_id: id }).del();
  await db("playlist_table").where({ playlist_id: id }).del();
};

const addToSongPlaylist = async (songId, playlistId) => {
  try {
    const clear = await preInsertCheckSongPlaylist(playlistId, songId);
    if (clear === 1) {
      return { err: "Song already exists in playlist" };
    }
    if (clear === 0) {
      await db("song_playlist_table").insert({
        song_id: songId,
        playlist_id: playlistId,
      });
      return { message: "success" };
    }
  } catch (err) {
    return err;
  }
};

const getPlaylistSongs = async (playlistId, page) => {
  const songs = await db("songs_table")
    .select("*")
    .innerJoin(
      "song_playlist_table",
      "songs_table.song_id",
      "song_playlist_table.song_id"
    )
    .whereRaw("song_playlist_table.playlist_id = ?", [playlistId])
    .leftJoin(
      "composer_table",
      "composer_table.composer_id",
      "songs_table.composer_id"
    )
    .leftJoin(
      "lyricist_table",
      "lyricist_table.lyricist_id",
      "songs_table.lyricist_id"
    )
    .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
    .leftJoin(
      "song_raga_table",
      "song_raga_table.raga_id",
      "songs_table.raga_id"
    )
    .leftJoin(
      "song_type_table",
      "song_type_table.song_type_id",
      "songs_table.song_type_id"
    )
    .limit(10)
    .offset(page * 10 - 10);

  const numberOfSongs = await db("songs_table")
    .select("*")
    .innerJoin(
      "song_playlist_table",
      "songs_table.song_id",
      "song_playlist_table.song_id"
    )
    .whereRaw("song_playlist_table.playlist_id = ?", [playlistId])
    .count();

  return { songs: songs, numOfSongs: Object.values(numberOfSongs[0]).at(-1) };
};

const delSongFromSongPlaylist = async (song_id) => {
  await db("song_playlist_table").where({ song_id: song_id }).del();
};

const searchFromDatabase = async (columnName, query, page) => {
  let results;
  let max_pages;

  String(columnName) === "undefined"
    ? (results = await db("songs_table")
        .select("*")
        .leftJoin(
          "composer_table",
          "composer_table.composer_id",
          "songs_table.composer_id"
        )
        .leftJoin(
          "lyricist_table",
          "lyricist_table.lyricist_id",
          "songs_table.lyricist_id"
        )
        .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
        .leftJoin(
          "song_raga_table",
          "song_raga_table.raga_id",
          "songs_table.raga_id"
        )
        .leftJoin(
          "song_type_table",
          "song_type_table.song_type_id",
          "songs_table.song_type_id"
        )
        .whereLike("song_name", `%${query}%`)
        .orWhereLike("song_type", `%${query}%`)
        .orWhereLike("song_raga", `%${query}%`)
        .orWhereLike("composer_name", `%${query}%`)
        .orWhereLike("lyricist_name", `%${query}%`)
        .orWhereLike("tuner_name", `%${query}%`)
        .limit(10)
        .offset(page * 10 - 10))
    : (results = await db("songs_table")
        .leftJoin(
          "composer_table",
          "composer_table.composer_id",
          "songs_table.composer_id"
        )
        .leftJoin(
          "lyricist_table",
          "lyricist_table.lyricist_id",
          "songs_table.lyricist_id"
        )
        .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
        .leftJoin(
          "song_raga_table",
          "song_raga_table.raga_id",
          "songs_table.raga_id"
        )
        .leftJoin(
          "song_type_table",
          "song_type_table.song_type_id",
          "songs_table.song_type_id"
        )
        .whereLike(columnName, `%${query}%`)
        .limit(10)
        .offset(page * 10 - 10));

  String(columnName) !== "undefined" &&
    (max_pages = await db("songs_table")
      .leftJoin(
        "composer_table",
        "composer_table.composer_id",
        "songs_table.composer_id"
      )
      .leftJoin(
        "lyricist_table",
        "lyricist_table.lyricist_id",
        "songs_table.lyricist_id"
      )
      .leftJoin("tuner_table", "tuner_table.tuner_id", "songs_table.tuner_id")
      .leftJoin(
        "song_raga_table",
        "song_raga_table.raga_id",
        "songs_table.raga_id"
      )
      .leftJoin(
        "song_type_table",
        "song_type_table.song_type_id",
        "songs_table.song_type_id"
      )
      .whereLike(columnName, `%${query}%`)
      .count());

  return {
    results: results,
    max_page:
      String(columnName) !== "undefined"
        ? Math.ceil(Object.values(max_pages[0])[0] / 10)
        : 0,
  };
};

const getSearchData = async () => {
  const composer = await db("composer_table").select("composer_name");
  const lyricist = await db("lyricist_table").select("lyricist_name");
  const tuner = await db("tuner_table").select("tuner_name");
  const types = await db("song_type_table").select("song_type");
  const ragas = await db("song_raga_table").select("song_raga");

  const results = {
    composers: composer.map((v) => {
      return Object.values(v)[0];
    }),
    lyricists: lyricist.map((v) => {
      return Object.values(v)[0];
    }),
    tuners: tuner.map((v) => {
      return Object.values(v)[0];
    }),
    types: types.map((v) => {
      return Object.values(v)[0];
    }),
    ragas: ragas.map((v) => {
      return Object.values(v)[0];
    }),
  };

  return results;
};

const getMasterContent = async (value) => {
  if (value === "type") {
    return await db("song_type_table").select("*");
  }
  if (value === "composer") {
    return await db("composer_table").select("*");
  }
  if (value === "lyricist") {
    return await db("lyricist_table").select("*");
  }
  if (value === "tuner") {
    return await db("tuner_table").select("*");
  }
  if (value === "raga") {
    return await db("song_raga_table").select("*");
  }
};

const getParticularMaster = async (masterType, id) => {
  if (masterType === "type") {
    return await db("song_type_table").select("*").where({ song_type_id: id });
  }
  if (masterType === "composer") {
    return await db("composer_table").select("*").where({ composer_id: id });
  }
  if (masterType === "lyricist") {
    return await db("lyricist_table").select("*").where({ lyricist_id: id });
  }
  if (masterType === "tuner") {
    return await db("tuner_table").select("*").where({ tuner_id: id });
  }
  if (masterType === "raga") {
    return await db("song_raga_table").select("*").where({ raga_id: id });
  }
};

const updateMasterContent = async (masterType, changes) => {
  if (masterType === "type") {
    await db("song_type_table")
      .where({ song_type_id: changes.id })
      .update({ song_type: changes.name });
    return await getParticularMaster(masterType, changes.id);
  }
  if (masterType === "composer") {
    await db("composer_table")
      .where({ composer_id: changes.id })
      .update({ composer_name: changes.name });
    return await getParticularMaster(masterType, changes.id);
  }
  if (masterType === "lyricist") {
    await db("lyricist_table")
      .where({ lyricist_id: changes.id })
      .update({ lyricist_name: changes.name });
    return await getParticularMaster(masterType, changes.id);
  }
  if (masterType === "tuner") {
    await db("tuner_table")
      .where({ tuner_id: changes.id })
      .update({ tuner_name: changes.name });
    return await getParticularMaster(masterType, changes.id);
  }
  if (masterType === "raga") {
    await db("song_raga_table")
      .where({ raga_id: id })
      .update({ song_raga: changes.name });
    return await getParticular(masterType, changes.id);
  }
};

const deleteMasterContent = async (masterType, id) => {
  if (masterType === "type") {
    await db("song_type_table").where({ song_type_id: id }).del();
  }
  if (masterType === "composer") {
    await db("composer_table").where({ composer_id: id }).del();
  }
  if (masterType === "lyricist") {
    await db("lyricist_table").where({ lyricist_id: id }).del();
  }
  if (masterType === "tuner") {
    await db("tuner_table").where({ tuner_id: id }).del();
  }
  if (masterType === "raga") {
    await db("song_raga_table").where({ raga_id: id }).del();
  }
};

module.exports = {
  addSong,
  all,
  del,
  update,
  getParticular,
  insertIntoPlaylist,
  getAllFromPlaylist,
  getParticularPlaylist,
  deletePlaylist,
  getPlaylistSongs,
  addToSongPlaylist,
  getAllSongsOnly,
  delSongFromSongPlaylist,
  searchFromDatabase,
  getSearchData,
  preUpdateChecks,
  updatePlaylist,
  getMasterContent,
  updateMasterContent,
  deleteMasterContent,
};

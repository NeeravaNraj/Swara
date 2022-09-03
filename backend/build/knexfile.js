// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const os = require("node:os");
const path = require("path");

const osType = os.type();

let fullDBStoragePath;
let migrations = path.join(__dirname, "migrations");
let seeds = path.join(__dirname, "seeds");

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
  fullAudioStoragePath = path.join(
    String(homedir),
    ".SwaraFiles",
    "db",
    "data.db"
  );
}
if (String(osType) === "Darwin") {
}

module.exports = {
  client: "sqlite3",
  connection: {
    filename: `${fullDBStoragePath}`,
  },
  useNullAsDefault: true,
  migrations: {
    directory: `${migrations}`,
  },
  seeds: {
    directory: `${seeds}`,
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run("PRAGMA foreign_keys = ON", cb);
    },
  },
};

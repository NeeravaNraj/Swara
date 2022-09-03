/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("song_playlist_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("song_playlist_table", (table) => {
        table
          .text("song_id")
          .notNullable()
          .references("song_id")
          .inTable("songs_table");
        table
          .text("playlist_id")
          .notNullable()
          .references("playlist_id")
          .inTable("playlist_table");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("song_playlist_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("song_playlist_table");
    }
  });
};

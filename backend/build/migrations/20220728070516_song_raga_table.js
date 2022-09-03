/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("song_raga_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("song_raga_table", (table) => {
        table.increments("raga_id").primary();
        table.text("song_raga", 256).notNullable().unique();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("playlist_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("song_raga_table");
    }
  });
};

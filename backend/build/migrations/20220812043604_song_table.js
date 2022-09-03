/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("songs_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("songs_table", (table) => {
        table.text("song_id", 20).primary();
        table.text("song_name", 256).notNullable();
        table.text("song_lyrics", 2048).nullable();
        table.integer("song_duration").notNullable();
        table.text("song_path", 512).notNullable();
        table.text("isFavourite", 5).defaultTo("false");
        table
          .text("raga_id", 128)
          .notNullable()
          .references("raga_id")
          .inTable("song_raga_table");
        table
          .text("song_type_id")
          .notNullable()
          .references("song_type_id")
          .inTable("song_type_table");
        table
          .text("composer_id")
          .nullable()
          .references("composer_id")
          .inTable("composer_table");
        table
          .text("lyricist_id")
          .nullable()
          .references("lyricist_id")
          .inTable("lyricist_table");
        table
          .text("tuner_id")
          .nullable()
          .references("tuner_id")
          .inTable("tuner_table");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("songs_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("songs_table");
    }
  });
};

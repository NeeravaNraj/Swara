/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  knex.schema.hasTable("image_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("image_table", (table) => {
        table
          .text("song_id")
          .notNullable()
          .references("song_id")
          .inTable("songs_table");
        table
          .text("image_path")
          .notNullable()
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("song_type_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("song_type_table", (table) => {
        table.increments("song_type_id").primary();
        table.text("song_type").notNullable().unique();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("song_type_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("song_type_table");
    }
  });
};

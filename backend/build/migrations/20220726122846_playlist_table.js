/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("playlist_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("playlist_table", (table) => {
        table.text("playlist_id", 42).primary();
        table.text("playlist_name", 256).notNullable();
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
      return knex.schema.dropTable("playlist_table");
    }
  });
};

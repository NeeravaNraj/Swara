/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("lyricist_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("lyricist_table", (table) => {
        table.increments("lyricist_id").primary();
        table.text("lyricist_name", 256).notNullable().unique();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("lyricist_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("lyricist_table");
    }
  });
};

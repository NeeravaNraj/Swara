/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("composer_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("composer_table", (table) => {
        table.increments("composer_id").primary();
        table.text("composer_name", 256).notNullable().unique();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.hasTable("composer_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("composer_table");
    }
  });
};

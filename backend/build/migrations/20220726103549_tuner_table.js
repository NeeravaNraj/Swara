/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema.hasTable("tuner_table").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("tuner_table", (table) => {
        table.increments("tuner_id").primary();
        table.text("tuner_name", 256).notNullable().unique();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.hasTable("tuner_table").then((exists) => {
    if (exists) {
      return knex.schema.dropTable("tuner_table");
    }
  });
};

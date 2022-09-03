/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('composer_table').del()
  await knex('composer_table').insert([
    {composer_id: 1, composer_name: 'unknown'},
  ]);
};

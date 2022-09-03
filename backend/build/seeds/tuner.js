/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tuner_table').del()
  await knex('tuner_table').insert([
    {tuner_id: 1, tuner_name: 'unknown'},
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('lyricist_table').del()
  await knex('lyricist_table').insert([
    {lyricist_id: 1, lyricist_name: 'unknown'},
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('song_type_table').del()
  await knex('song_type_table').insert([
    {song_type_id: 1, song_type: 'Bhajan'},
    {song_type_id: 2, song_type: 'Devaranama'},
    {song_type_id: 3, song_type: 'Geete'},
    {song_type_id: 4, song_type: 'Keerthana'},
    {song_type_id: 5, song_type: 'Kriti'},
    {song_type_id: 6, song_type: 'Lakshana Geete'},
  ]);
};

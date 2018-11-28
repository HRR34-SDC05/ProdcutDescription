const table = 'descriptions';
const fields = 'product_id, product_name, features, tech_specs'
module.exports.table = table;
module.exports.fields = fields;

// SQL statement to create table in Postgres
// CREATE TABLE descriptions (
//   product_id INTEGER NOT NULL,
//   product_name VARCHAR (255),
//   features TEXT[],
//   tech_specs JSONB,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
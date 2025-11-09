const db = require('../config/database');

class Rating { static async findAll(filters = {}, sort = '-created_date') { let query = 'SELECT * FROM ratings WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.rating_type) {
  query += ` AND rating_type = $${paramCount++}`;
  params.push(filters.rating_type);
}

if (filters.event_id) {
  query += ` AND event_id = $${paramCount++}`;
  params.push(filters.event_id);
}

if (filters.resource_id) {
  query += ` AND resource_id = $${paramCount++}`;
  params.push(filters.resource_id);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findById(id) { const result = await db.query('SELECT * FROM ratings WHERE id = $1', [id]); return result.rows[0]; }

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO ratings (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE ratings
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM ratings WHERE id = $1', [id]); } }

module.exports = Rating;
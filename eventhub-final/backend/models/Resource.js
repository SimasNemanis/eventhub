const db = require('../config/database');

class Resource { static async findAll(filters = {}, sort = 'name') { let query = 'SELECT * FROM resources WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.type) {
  query += ` AND type = $${paramCount++}`;
  params.push(filters.type);
}

if (filters.available !== undefined) {
  query += ` AND available = $${paramCount++}`;
  params.push(filters.available);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findById(id) { const result = await db.query('SELECT * FROM resources WHERE id = $1', [id]); return result.rows[0]; }

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO resources (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE resources
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM resources WHERE id = $1', [id]); } }

module.exports = Resource;
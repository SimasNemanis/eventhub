const db = require('../config/database');

class User { static async findAll(filters = {}, sort = 'full_name') { let query = 'SELECT * FROM users WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.role) {
  query += ` AND role = $${paramCount++}`;
  params.push(filters.role);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findById(id) { const result = await db.query('SELECT * FROM users WHERE id = $1', [id]); return result.rows[0]; }

static async findByEmail(email) { const result = await db.query('SELECT * FROM users WHERE email = $1', [email]); return result.rows[0]; }

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO users (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE users
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM users WHERE id = $1', [id]); } }

module.exports = User;
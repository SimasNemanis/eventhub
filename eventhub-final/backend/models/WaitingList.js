const db = require('../config/database');

class WaitingList { static async findAll(filters = {}, sort = 'position') { let query = 'SELECT * FROM waiting_list WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.event_id) {
  query += ` AND event_id = $${paramCount++}`;
  params.push(filters.event_id);
}

if (filters.status) {
  query += ` AND status = $${paramCount++}`;
  params.push(filters.status);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findByUserId(userId) { const result = await db.query( 'SELECT * FROM waiting_list WHERE user_id = $1 ORDER BY created_date DESC', [userId] ); return result.rows; }

static async findById(id) { const result = await db.query('SELECT * FROM waiting_list WHERE id = $1', [id]); return result.rows[0]; }

static async findByEventAndUser(eventId, userId) { const result = await db.query( 'SELECT * FROM waiting_list WHERE event_id = $1 AND user_id = $2', [eventId, userId] ); return result.rows[0]; }

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO waiting_list (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE waiting_list
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM waiting_list WHERE id = $1', [id]); } }

module.exports = WaitingList;
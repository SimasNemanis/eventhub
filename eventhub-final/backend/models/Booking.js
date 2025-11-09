const db = require('../config/database');

class Booking { static async findAll(filters = {}, sort = '-created_date') { let query = 'SELECT * FROM bookings WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.booking_type) {
  query += ` AND booking_type = $${paramCount++}`;
  params.push(filters.booking_type);
}

if (filters.status) {
  query += ` AND status = $${paramCount++}`;
  params.push(filters.status);
}

if (filters.date) {
  query += ` AND date = $${paramCount++}`;
  params.push(filters.date);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findByUserId(userId) { const result = await db.query( 'SELECT * FROM bookings WHERE created_by = $1 ORDER BY created_date DESC', [userId] ); return result.rows; }

static async findById(id) { const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]); return result.rows[0]; }

static async findByResourceAndDate(resourceId, date, excludeId = null) { let query = 'SELECT * FROM bookings WHERE resource_id = $1 AND date = $2 AND status = $3'; const params = [resourceId, date, 'confirmed'];

if (excludeId) {
  query += ' AND id != $4';
  params.push(excludeId);
}

const result = await db.query(query, params);
return result.rows;
}

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO bookings (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE bookings
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM bookings WHERE id = $1', [id]); } }

module.exports = Booking;
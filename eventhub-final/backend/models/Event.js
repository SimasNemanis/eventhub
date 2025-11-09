const db = require('../config/database');

class Event { static async findAll(filters = {}, sort = '-date') { let query = 'SELECT * FROM events WHERE 1=1'; const params = []; let paramCount = 1;

if (filters.category) {
  query += ` AND category = $${paramCount++}`;
  params.push(filters.category);
}

if (filters.status) {
  query += ` AND status = $${paramCount++}`;
  params.push(filters.status);
}

if (filters.date_from) {
  query += ` AND date >= $${paramCount++}`;
  params.push(filters.date_from);
}

if (filters.date_to) {
  query += ` AND date <= $${paramCount++}`;
  params.push(filters.date_to);
}

const orderBy = sort.startsWith('-') ? `${sort.substring(1)} DESC` : `${sort} ASC`;
query += ` ORDER BY ${orderBy}`;

const result = await db.query(query, params);
return result.rows;
}

static async findById(id) { const result = await db.query('SELECT * FROM events WHERE id = $1', [id]); return result.rows[0]; }

static async create(data) { const fields = Object.keys(data); const values = Object.values(data); const placeholders = values.map((_, i) => $${i + 1}).join(', ');

const query = `
  INSERT INTO events (${fields.join(', ')})
  VALUES (${placeholders})
  RETURNING *
`;

const result = await db.query(query, values);
return result.rows[0];
}

static async bulkCreate(eventsArray) { const client = await db.connect(); try { await client.query('BEGIN'); const events = [];

  for (const eventData of eventsArray) {
    const fields = Object.keys(eventData);
    const values = Object.values(eventData);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO events (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await client.query(query, values);
    events.push(result.rows[0]);
  }

  await client.query('COMMIT');
  return events;
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
}

static async update(id, data) { const fields = Object.keys(data); const values = Object.values(data); const setClause = fields.map((field, i) => ${field} = $${i + 2}).join(', ');

const query = `
  UPDATE events
  SET ${setClause}, updated_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
`;

const result = await db.query(query, [id, ...values]);
return result.rows[0];
}

static async delete(id) { await db.query('DELETE FROM events WHERE id = $1', [id]); } }

module.exports = Event;
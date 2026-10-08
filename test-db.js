import pool from './db.js';

try {
    const result = await pool.query('SELECT NOW()');
    console.log('PostgreSQL Connected Successfully!');
    console.log(result.rows[0]);
} catch (error) {
    console.error('PostgreSQL Connection Failed!');
    console.error(error.message);
} finally {
    await pool.end();
}
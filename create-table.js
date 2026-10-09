import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://namlatic_db_user:DLWdTvxb7ep5sYq3n6Yjgm7pDIoeAnJQ@dpg-db3qcou0tbcc738i2pug-a.oregon-postgres.render.com/namlatic_db",
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTable() {
  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        rating NUMERIC(2,1),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        location_name TEXT,
        image TEXT,
        amenities JSONB
      );
    `);

    console.log("Hotels table created successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

createTable();
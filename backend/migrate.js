const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

// SQLite DB Path
const sqliteDbPath = path.resolve(__dirname, '../game.db');

// Postgres Credentials
const pgClient = new Client({
  host: 'ep-delicate-cloud-a4x28aye-pooler.us-east-1.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_4JuWrz1qIOfM',
  database: 'balloon_game',
  ssl: { rejectUnauthorized: false },
});

const sqliteDb = new sqlite3.Database(sqliteDbPath);

async function migrate() {
  try {
    await pgClient.connect();
    console.log('Connected to Postgres');

    // Create table if not exists (matching the Entity)
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS "players" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "place" VARCHAR,
        "age" INTEGER,
        "gender" VARCHAR,
        "highScore" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Table players ensured');

    // Read from SQLite
    sqliteDb.all('SELECT * FROM players', [], async (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(`Found ${rows.length} players in SQLite`);

      for (const row of rows) {
        try {
            // Check if exists
            const res = await pgClient.query('SELECT id FROM players WHERE name = $1', [row.name]);
            if (res.rows.length > 0) {
                console.log(`Skipping ${row.name}, already exists`);
                continue;
            }

            await pgClient.query(
              `INSERT INTO "players" ("name", "place", "age", "gender", "highScore", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,
              [row.name, row.place, row.age, row.gender, row.highScore, new Date(row.createdAt)]
            );
            console.log(`Inserted ${row.name}`);
        } catch (e) {
            console.error(`Error inserting ${row.name}:`, e);
        }
      }

      console.log('Migration complete');
      await pgClient.end();
      sqliteDb.close();
    });

  } catch (err) {
    console.error('Migration failed', err);
    await pgClient.end();
    sqliteDb.close();
  }
}

migrate();

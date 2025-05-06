import { Client } from 'pg';

export const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const initializeConnection = async () => {
  try {
    await client.connect();
    console.log('Database connected successfully');

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      );
    `);

    const result = await client.query(`SELECT COUNT(*) FROM projects`);

    if (result.rows[0].count === '0') {
      await client.query(
        `INSERT INTO projects (name, description) VALUES 
        ('Project Alpha', 'A React project.'),
        ('Project Beta', 'A scalable solution for modern problems')
    `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};
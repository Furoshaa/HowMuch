import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool instead of individual connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0
});

// Test the pool connection
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL pool connected successfully');
        connection.release();
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
};

// Export the pool for use in controllers
export const db = pool;
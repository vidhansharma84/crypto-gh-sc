import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "fnx_trading",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection on startup
pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL connected successfully to", process.env.MYSQL_DATABASE || "fnx_trading");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
  });

export default pool;

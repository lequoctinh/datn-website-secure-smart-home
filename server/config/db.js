// server/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");   

const pool = mysql.createPool({
host: process.env.DB_HOST || "127.0.0.1",
user: process.env.DB_USER || "root",
password: process.env.DB_PASS || "",
database: process.env.DB_NAME || "websitenexahome",
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
dateStrings: true,
});

module.exports = pool; // bạn đang require(pool) trực tiếp trong controller
// hoặc nếu thích:
// module.exports = { pool };

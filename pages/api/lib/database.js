const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: process.env.DB_PASSWORD,
    host: "localhost",
    port: 5555,
    database: "payments"
})

module.exports = pool;
require("dotenv").config();

module.exports = {
  client: "mysql2",
  connection: {
    host: "0.0.0.0",
    port: 3309,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 7 },
  // searchPath: ["knex", "public"],
};

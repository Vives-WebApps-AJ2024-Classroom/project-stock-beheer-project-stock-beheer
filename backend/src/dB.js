const mysql = require("mysql2");
require("dotenv").config();

let connection;

try {
  connection = mysql.createConnection({
    password: process.env.MYSQL_PASSWORD,
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true,
  });

  try {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1);
      }
    });
  } catch (err) {
    process.exit(1);
  }
} catch (err) {
  console.log(err);
  process.exit(1);
}

connection.on("error", function (err) {
  console.log("Error in database connection");
  console.log(err);
  process.exit(1);
});

connection.on("connect", function () {
  console.log("connected to database");
  createTable();
});

const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS effects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      preDefined BOOLEAN NOT NULL,
      effectData TEXT NOT NULL
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    console.log("Table created successfully");
  });
};

module.exports = {};

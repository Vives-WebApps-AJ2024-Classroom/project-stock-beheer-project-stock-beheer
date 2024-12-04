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
    insecureAuth: true
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
  createTables();
});

const createTables = () => {
  // Maak tabel 'project'
  const createProjectTableQuery = `
    CREATE TABLE IF NOT EXISTS project (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_naam VARCHAR(255) NOT NULL
    );
  `;

  connection.query(createProjectTableQuery, (err) => {
    if (err) {
      console.error("Error creating table 'projects':", err);
      return;
    }
    console.log("Table 'project' created or already exists.");
  });

  const createProductenTableQuery = `
    CREATE TABLE IF NOT EXISTS producten (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Leveringsadres VARCHAR(255) NOT NULL,
      Datum_aanvraag DATE NOT NULL,
      Aantal INT NOT NULL,
      Korte_omschrijving TEXT NOT NULL,
      Winkel VARCHAR(255) NOT NULL,
      Artikelnummer VARCHAR(255) NOT NULL,
      URL VARCHAR(2083),
      Totale_kostprijs_excl_BTW DECIMAL(10, 2) NOT NULL,
      Aangevraagd_door VARCHAR(255) NOT NULL,
      Aantal_dagen_levertijd INT NOT NULL,
      Goedgekeurd_door_coach BOOLEAN DEFAULT FALSE,
      Bestelling_ingegeven_RQ_nummer VARCHAR(255),
      Bestelling_door_financ_dienst_geplaatst BOOLEAN DEFAULT FALSE,
      Bestelling_verzonden_verwachtte_aankomst DATE,
      Bestelling_ontvangen_datum DATE,
      Opmerkingen TEXT,
      Totaalprijs_project DECIMAL(10, 2),
      project_id INT,
      FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET NULL
    );
  `;

  connection.query(createProductenTableQuery, (err) => {
    if (err) {
      console.error("Error creating table 'producten':", err);
      return;
    }
    console.log("Table 'producten' created or already exists.");
  });
};

module.exports = {};

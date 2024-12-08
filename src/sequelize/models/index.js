"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require("../../config/config");
const db = {};

let sequelize;
try {
  // Read database connection settings from environment variables or config
  const dbHost = process.env.DB_HOST || config.db[env].host;
  const dbPort = process.env.DB_PORT || config.db[env].port;
  const dbUser = process.env.DB_USERNAME || config.db[env].username;
  const dbPassword = process.env.DB_PASSWORD || config.db[env].password;
  const dbName = process.env.DB_NAME || config.db[env].database;

  // Log connection attempt details
  console.log(
    `🚀 ~ DatabaseConnection ~ connect ~ Attempting to connect to database ${dbName} at ${dbHost}:${dbPort}`
  );

  // Create Sequelize connection
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    dialectOptions: {
      ssl:
        env === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  });

  // Log connection success
  console.log("Database connection established successfully.");
} catch (error) {
  // Log error and exit on connection failure
  console.error("Error connecting to the database:", error);
  process.exit(1);
}

// Load models dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Initialize associations (if any)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

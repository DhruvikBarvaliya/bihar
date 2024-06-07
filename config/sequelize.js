const Sequelize = require("sequelize");
const config = require("./config");
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    pool: config.pool,
    logging: false,
  }
);

const User = require("../models/user")(sequelize, Sequelize);
const Inventory = require("../models/inventory")(sequelize, Sequelize);

// Relationships

module.exports = {
  sequelize,
  User,
  Inventory,
};
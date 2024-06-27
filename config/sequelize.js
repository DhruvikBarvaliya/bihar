const { Sequelize } = require("sequelize");
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
const Store = require("../models/store")(sequelize, Sequelize);
const Inventory = require("../models/inventory")(sequelize, Sequelize);
const Category = require("../models/category")(sequelize, Sequelize);
const Unit = require("../models/unit")(sequelize, Sequelize);

// Relationships
Store.hasMany(User, { foreignKey: "store_id", as: "users" });
User.belongsTo(Store, { foreignKey: "store_id", as: "store" });

Store.hasMany(Inventory, { foreignKey: "store_id", as: "inventory" });
Inventory.belongsTo(Store, { foreignKey: "store_id", as: "store" });

Category.hasMany(Inventory, { foreignKey: "category_id", as: "inventory" });
Inventory.belongsTo(Category, { foreignKey: "category_id", as: "category" });

Unit.hasMany(Inventory, { foreignKey: "unit_id", as: "inventory" });
Inventory.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });

module.exports = { sequelize, User, Store, Inventory, Category, Unit };

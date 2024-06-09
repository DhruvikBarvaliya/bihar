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
  },
);

const User = require("../models/user")(sequelize, Sequelize);
const Store = require("../models/store")(sequelize, Sequelize);
const Inventory = require("../models/inventory")(sequelize, Sequelize);
const StoreInventory = require("../models/storeInventory")(
  sequelize,
  Sequelize,
);

// Relationships
Store.hasMany(User, {
  foreignKey: "store_id",
  as: "users",
});

User.belongsTo(Store, {
  foreignKey: "store_id",
  as: "store",
});

Store.belongsToMany(Inventory, {
  through: StoreInventory,
  foreignKey: "store_id",
  otherKey: "inventory_id",
  as: "Inventory",
});

Inventory.belongsToMany(Store, {
  through: StoreInventory,
  foreignKey: "inventory_id",
  otherKey: "store_id",
  as: "stores",
});

module.exports = {
  sequelize,
  User,
  Store,
  Inventory,
  StoreInventory,
};

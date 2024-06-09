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
  foreignKey: "storeId",
  as: "users",
});

User.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});

Store.belongsToMany(Inventory, {
  through: StoreInventory,
  foreignKey: "storeId",
  otherKey: "inventoryId",
  as: "Inventory",
});

Inventory.belongsToMany(Store, {
  through: StoreInventory,
  foreignKey: "inventoryId",
  otherKey: "storeId",
  as: "stores",
});

module.exports = {
  sequelize,
  User,
  Store,
  Inventory,
  StoreInventory,
};

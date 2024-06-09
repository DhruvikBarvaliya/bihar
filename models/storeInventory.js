module.exports = (sequelize, DataTypes) => {
  const StoreInventory = sequelize.define(
    "StoreInventory",
    {
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: "stores",
          key: "id",
        },
        primaryKey: true,
      },
      inventory_id: {
        type: DataTypes.UUID,
        references: {
          model: "inventories",
          key: "id",
        },
        primaryKey: true,
      },
    },
    {
      tableName: "store_inventory",
      timestamps: true,
      underscored: true,
    }
  );

  return StoreInventory;
};

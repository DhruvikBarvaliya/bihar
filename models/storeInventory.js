module.exports = (sequelize, DataTypes) => {
  const StoreInventory = sequelize.define(
    "StoreInventory",
    {
      storeId: {
        type: DataTypes.UUID,
        references: {
          model: "stores",
          key: "id",
        },
        primaryKey: true,
      },
      productId: {
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
    },
  );

  return StoreInventory;
};

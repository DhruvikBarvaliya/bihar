module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: "stores",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "inventories",
      timestamps: true,
      underscored: true,
    },
  );

  return Inventory;
};

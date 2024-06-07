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
      unit: {
        type: DataTypes.BIGINT,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "inventories",
      timestamps: true,
      underscored: true,
    }
  );

  return Inventory;
};

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
      value: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      specification: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: "stores",
          key: "id",
        },
        allowNull: false,
      },
      category_id: {
        type: DataTypes.UUID,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
      },
      unit_id: {
        type: DataTypes.UUID,
        references: {
          model: "units",
          key: "id",
        },
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
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

// models/store.js
module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define(
    "Unit",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      unit_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit_value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "units",
      timestamps: true,
      underscored: true,
    }
  );

  return Unit;
};

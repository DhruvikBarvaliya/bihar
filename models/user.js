// models/user.js
module.exports = (sequelize, DataTypes) => {
  const { UUID, UUIDV4, ENUM, STRING, BOOLEAN, INTEGER } = DataTypes;

  const User = sequelize.define(
    "User",
    {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      role: {
        type: ENUM(
          "Super Admin",
          "Admin",
          "JE",
          "AEE",
          "EEE",
          "ESE",
          "CE",
          "Store In Charge"
        ),
        allowNull: false,
      },
      username: {
        type: STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      is_active: {
        type: BOOLEAN,
        defaultValue: false,
      },
      is_verified: {
        type: BOOLEAN,
        defaultValue: false,
      },
      verified_otp: {
        type: INTEGER,
      },
      forgot_otp: {
        type: INTEGER,
      },
      store_id: {
        type: UUID,
        allowNull: false,
        references: {
          model: "stores",
          key: "id",
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};

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
      },
      username: {
        type: STRING,
        unique: true,
      },
      email: {
        type: STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: STRING,
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
        references: {
          model: "stores",
          key: "id",
        },
        allowNull: false,
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

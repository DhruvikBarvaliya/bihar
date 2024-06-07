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
          "SUPER_ADMIN",
          "ADMIN",
          "JE",
          "AEE",
          "EEE",
          "ESE",
          "CE",
          "STORE_IN_CHARGE"
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
        defaultValue: true,
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
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};

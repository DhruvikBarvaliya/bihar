module.exports = (sequelize, DataTypes) => {
  const Requisition = sequelize.define(
    "Requisition",
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      required_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      approval_je: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      approval_aee: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      approval_eee: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      approval_ese: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      approval_ce: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      current_approval_step: {
        type: DataTypes.ENUM("JE", "AEE", "EEE", "ESE", "CE"),
        defaultValue: "JE",
        allowNull: false,
      },
      approved_date_je: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_date_aee: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_date_eee: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_date_ese: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_date_ce: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
      },
      comments: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "requisitions",
      timestamps: true,
      underscored: true,
    }
  );

  return Requisition;
};

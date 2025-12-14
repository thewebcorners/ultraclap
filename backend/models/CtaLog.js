// models/CtaLog.js
module.exports = (sequelize, DataTypes) => {
  const CtaLog = sequelize.define("CtaLog", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    business_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true }, // guest allowed
    action: { type: DataTypes.STRING, allowNull: false }, // call / whatsapp / visit
    ip: { type: DataTypes.STRING },
    user_agent: { type: DataTypes.STRING },
  });

  CtaLog.associate = (models) => {
    CtaLog.belongsTo(models.Business, { foreignKey: "business_id" });
    CtaLog.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return CtaLog;
};

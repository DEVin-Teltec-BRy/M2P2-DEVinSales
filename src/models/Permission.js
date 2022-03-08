const { DataTypes, Model } = require("sequelize");

class Permission extends Model {
  static init(sequelize) {
    super.init(
      {
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            msg: "A descrição deve ser única",
          },
        },
      },
      {
        sequelize,
        hooks: {
          beforeCreate: (permission) => {
            permission.description = permission.description.toUpperCase();
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.Role, {
      foreignKey: "permission_id",
      through: "permissions_roles",
      as: "role",
    });
  }
}

module.exports = Permission;

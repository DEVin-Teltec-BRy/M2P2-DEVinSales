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
          validate: {
            len: {
              msg: "A descrição da permissão deve ter entre 4 e 10 caracteres.",
              args: [4,10]
            }
          }
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

const { DataTypes, Model } = require("sequelize");
const { hashPassword } = require("../hooks/userHooks");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          get() {
            const name = this.getDataValue("name");
            return name;
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            msg: "E-mail deve ser único",
          },
          validate: {
            isEmail: {
              msg: "Esse e-mail não é válido",
            },
          },
          get() {
            const email = this.getDataValue("email");
            return email;
          },
        },
        birth_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          get() {
            const formatedDate = this.getDataValue("birth_date");
            return formatedDate ? formatedDate.toLocaleDateString() : null;
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        hooks: {
          beforeCreate: async (user) => {
            user.password = await hashPassword(user.password);
          },
        },
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.Role, {
      foreignKey: "user_id",
      through: "users_roles",
      as: "roles",
    });

    this.hasMany(models.Sale, {
      foreignKey: "buyer_id",
      as: "buyer_sales",
    });
  }
}
module.exports = User;

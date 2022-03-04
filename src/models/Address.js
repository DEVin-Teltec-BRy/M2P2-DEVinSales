const { DataTypes, Model } = require('sequelize')

class Address extends Model {
    static init(sequelize) {
        super.init(
        {
            street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            complement: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: false
            }
            
        }, {sequelize})
    }
    // static associate(models) {
    //     this.belongsTo(
    //         models.City, {
    //         foreignKey: 'city_id', // Qual chave estrangeira dentro de Posts que representa o usuario
    //         as: 'cities' // nome do relacionamento
    //     });
    // }
}

module.exports = Address;
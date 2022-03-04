const { DataTypes, Model } = require('sequelize')

class Adress extends Model {
    static init(sequelize) {
        super.init(
        {
            street: {
                type: Datatypes.STRING,
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
    static associate(models) {
        this.belongsTo(
            models.City, {
            foreignKey: 'city_id', // Qual chave estrangeira dentro de Posts que representa o usuario
            as: 'city' // nome do relacionamento
        });
    }
}

export default Adress;
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
                allowNull: true
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: false
            }
            
        }, {sequelize, 
            tableName:'adress'
        })
    }
    static associate(models) {
        this.belongsTo(
            models.City, {
            foreignKey: 'city_id', // Qual chave estrangeira dentro de Posts que representa o usuario
            as: 'city' // nome do relacionamento
        });
        this.belongsTo(
            models.Delivey, {
            foreignKey: '',
            as: 'delivery'
        });
    }
}

export default Adress;
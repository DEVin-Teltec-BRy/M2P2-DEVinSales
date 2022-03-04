const { DataTypes, Model } = require('sequelize')

class Adress extends Model {
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
    static associate(models) {
        this.belongsTo(
            models.City, {
            foreignKey: 'city_id', 
            as: 'cities' 
        });
        this.belongsTo(
            models.Delivery, {
            foreignKey: 'delivery_id', 
            as: 'deliveries' 
        
        })
   }
}

module.exports = Adress;
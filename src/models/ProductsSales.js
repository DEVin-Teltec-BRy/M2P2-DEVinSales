const { DataTypes, Model } = require('sequelize')

class ProductSales extends Model {
    static init(sequelize){
        super.init({
            unit_price: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },{sequelize}
        })
    }
}

module.exports = ProductSales

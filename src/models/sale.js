'use strict';

const { Model, DataTypes} = require('sequelize');

  class Sale extends Model {
 static init(sequelize) {
   super.init(
     {
       seller_id:{
       type:DataTypes.INTEGER,
         allowNull:true,
     },
     buyer_id:{
      type:DataTypes.INTEGER,
        allowNull:false,
    },
    dt_sale:{
      type:DataTypes.DATE,
      allowNull:false
    }

     },
    { sequelize,
     modelName:"Sale"
    }
   )
 }
    static associate(models) {
      Sale.belongsToMany(models.User,{
        foreignKey:'id',
        through:'user',
        constraints:true
      })
    }
  }


module.exports = Sale
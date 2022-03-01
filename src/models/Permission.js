const connection = require('../database')
const { DataTypes } = require('sequelize')
const Permission = connection.define('permissions', 
    {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'A permissão deve ser única'
            }
        }    
    }
)

module.exports = Permission
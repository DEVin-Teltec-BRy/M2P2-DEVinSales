const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: async (password) => {
        return bcrypt.hash(password, 8)
    }
}
const bcrypt = require("bcrypt");
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);

const createUser = (name, email, birth_date, password) => {
  const passwordHash = bcrypt.hashSync(password, salt);
  return {
    name,
    email,
    birth_date,
    password: passwordHash,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

module.exports = {
  User1: createUser("Sabrina", "sabrina1@gmail.com", "12/01/1980", "K79OUIOj"),
  User2: createUser("Daniel", "Daniel12@gmail.com", "02/02/1985", "123456789"),
  User3: createUser("Luciano", "luciano3@gmail.com", "05/04/2000", "Lu123.1"),
  User4: createUser(
    "Victor",
    "Bertramvictor123@gmail.com",
    "22/08/2000",
    "VictorD12."
  ),
};

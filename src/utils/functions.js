function validateErrors(error) {
  if (error.errors) {
    const [err] = error.errors;
    return {
      message: err.message,
    };
  }
  if (error.message) {
    return { message: error.message };
  }
}

function stringToDate(string) {
  const [day, month, year] = string.split("/");
  return new Date(year, Number(month) - 1, day);
}

function PostUserPasswordValidation(password) {
  if (password.length >= 4) {
    let validation = true;
    const noRepeatedCharacters = [...password];
    let passwordArray = [...noRepeatedCharacters];
    for (let i = 0; i < noRepeatedCharacters.length; i++) {
      let character = noRepeatedCharacters[i];
      passwordArray.splice(0, 1);
      if (passwordArray.includes(character) === true) {
        validation = false;
      }
    }
    return validation;
  } else return res.status(400).send({ message: "Bad Request" });
}

function verifyAge(PersonAge) {
  let ageValidation = false;
  const today = new Date();
  let age = today.getFullYear() - PersonAge.getFullYear();
  const month = today.getMonth() - PersonAge.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < PersonAge.getDate())) {
    age--;
  }
  if (age >= 18) {
    ageValidation = true;
  }
  return ageValidation;
}

module.exports = {
  validateErrors,
  stringToDate,
  PostUserPasswordValidation,
  verifyAge,
};

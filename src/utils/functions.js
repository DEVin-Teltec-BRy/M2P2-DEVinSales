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
  const [day, month, year] = string.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function daysToDelivery(addDays) {
  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  const date = new Date();
  return date.addDays(addDays);
}

function PostUserPasswordValidation(password) {
  let validation = false;
  if (password.length >= 4) {
    const noRepeatedCharacters = [...password];
    let passwordArray = [...noRepeatedCharacters];
    let newArray = [];
    for (let i = 0; i < noRepeatedCharacters.length; i++) {
      let character = noRepeatedCharacters[i];
      passwordArray.splice(0, 1);
      if (
        passwordArray.includes(character) === true ||
        newArray.includes(character) === true
      ) {
        validation = false;
      } else {
        validation = true;
      }
      newArray.push(character);
    }
    return validation;
  } else {
    return (validation = false);
  }
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

function verifyDate(date) {
  const daysInMonth = function (month, year) {
    switch (month) {
      case 1:
        return (year % 4 == 0 && year % 100) || year % 400 == 0 ? 29 : 28;
      case 8:
      case 3:
      case 5:
      case 10:
        return 30;
      default:
        return 31;
    }
  };
  const isValidDate = function (day, month, year) {
    month = parseInt(month, 10) - 1;
    return (
      month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year)
    );
  };

  const [day, month, year] = date.split("/");

  let dateValidation = null;
  const dateFormat = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/;
  if (date.match(dateFormat) && isValidDate(day, month, year)) {
    dateValidation = true;
  } else {
    dateValidation = false;
  }
  return dateValidation;
}

module.exports = {
  validateErrors,
  stringToDate,
  PostUserPasswordValidation,
  verifyAge,
  verifyDate,
  daysToDelivery,
};

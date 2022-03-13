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

module.exports = {
  validateErrors,
  stringToDate,
};

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

module.exports = {
  validateErrors,
  stringToDate,
};

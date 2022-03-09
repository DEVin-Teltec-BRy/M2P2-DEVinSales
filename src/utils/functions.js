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

function checkAge(birth_date) {
  const now = new Date();
  const birth = new Date(
    birth_date.split("/")[2],
    birth_date.split("/")[1] - 1,
    birth_date.split("/")[0]
  );
  const now_y = now.getFullYear();
  const birth_y = birth.getFullYear();
  const now_m = now.getMonth() + 1;
  const birth_m = birth.getMonth() + 1;
  const now_d = now.getDate();
  const birth_d = birth.getDate();
  let age = now_y - birth_y;
  if (now_m == birth_m) {
    if (birth_d < now_d) {
      age--;
    }
  } else if (birth_m - now_m) {
    age--;
  }
  return age
}

module.exports = {
  validateErrors,
  stringToDate,
  checkAge
};

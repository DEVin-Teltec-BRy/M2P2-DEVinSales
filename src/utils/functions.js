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
  return new Date(Number(year), Number(month) - 1, Number(day) + 1);
}

function daysToDelivery(number){
    Date.prototype.addDays = function(days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }    
    const date = new Date();    
    return date.addDays(7);
}

module.exports = {
  validateErrors,
  stringToDate,
  daysToDelivery,
};

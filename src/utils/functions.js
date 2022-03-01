function validateErrors(error){
  if(error.errors){
    const [err] = error.errors
    return {
      message: err.message 
    }
  }
  if(error.message){
    return {message: error.message}
  }
}

module.exports = {
  validateErrors
}
class AppErr extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = "failure";
  }
}

const appErr = (message, statusCode) => {
  let err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = {
  appErr,
  AppErr,
};

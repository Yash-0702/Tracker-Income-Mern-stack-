const globalErrHandler = (err, req, res, next) => {
  //message
  //status
  //statusCoe
  //stack

  const statusCode = (err.statusCode = err.statusCode || 500);
  const status = (err.status = err.status || "error");
  const message = (err.message = err.message || "Something went wrong");
  const stack = (err.stack = err.stack);
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

module.exports = globalErrHandler;

// errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err); 
  const statusCode = err.status||500;
  res.status(statusCode).json({
    message: err.message||"internal server error",
  });
};

module.exports = errorHandler;

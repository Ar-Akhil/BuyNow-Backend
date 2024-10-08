const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/user");

///check if user is authenticated or not
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

//Handling user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} are not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

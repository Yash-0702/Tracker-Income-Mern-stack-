const { AppErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify token
  const decodedUser = verifyToken(token);

  //save the user into req object
  req.user = decodedUser.id;
  if (!decodedUser) {
    return next(new AppErr("Invalid/Expired Token, Please Login Again", 400));
  }
  next();
};

module.exports = isLogin;

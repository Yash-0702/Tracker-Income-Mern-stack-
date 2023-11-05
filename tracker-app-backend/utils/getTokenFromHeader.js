const getTokenFromHeader = (req) => {
  //how get the token from header
  // console.log(req.headers);
  const headerObj = req.headers;
  const token = headerObj.authorization.split(" ")[1];
  // console.log(token);
  if (token !== undefined) {
    return token;
  } else {
    return {
      status: "failed",
      message: "There is no token attached to the header",
    };
  }
};

module.exports = getTokenFromHeader;

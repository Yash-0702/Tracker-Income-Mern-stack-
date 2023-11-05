const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  profileUserCtrl,
  deleteUserCtrl,
  updateUserCtrl,
} = require("../../controllers/users/usersCtrl");
const isLogin = require("../../middleware/isLogin");

const usersRoute = express.Router();

//POST/register
usersRoute.post("/register", registerUserCtrl);

//POST/login
usersRoute.post("/login", loginUserCtrl);

//Get/profile/
usersRoute.get("/profile/", isLogin, profileUserCtrl);

//Delete/
usersRoute.delete("/", isLogin, deleteUserCtrl);

//Put/
usersRoute.put("/", isLogin, updateUserCtrl);

module.exports = usersRoute;

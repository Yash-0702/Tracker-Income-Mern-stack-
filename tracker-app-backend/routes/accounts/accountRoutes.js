const express = require("express");
const {
  createAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
  getAccountCtrl,
  getAccountsCtrl,
} = require("../../controllers/accounts/accountsCtrl");
const isLogin = require("../../middleware/isLogin");

const accountRoute = express.Router();

//POST
accountRoute.post("/", isLogin, createAccountCtrl);

//Get/api/v1/accounts/:id
accountRoute.get("/:id", getAccountCtrl);

//Delete/api/v1/accounts/:id
accountRoute.delete("/:id", deleteAccountCtrl);

//Put/api/v1/accounts/:id
accountRoute.put("/:id", updateAccountCtrl);

//get/api/v1/accounts/
accountRoute.get("/", getAccountsCtrl);

module.exports = accountRoute;

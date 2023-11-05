const express = require("express");
const {
  createtransactionCtrl,
  gettransactionsCtrl,
  gettransactionCtrl,
  deletetransactionCtrl,
  updatetransactionCtrl,
} = require("../../controllers/transactions/transactionsCtrl");
const isLogin = require("../../middleware/isLogin");

const transactionsRoute = express.Router();

//POST/api/v1/transactions
transactionsRoute.post("/", isLogin, createtransactionCtrl);

//Get/api/v1/transactions
transactionsRoute.get("/", gettransactionsCtrl);

//Get/api/v1/transactions/:id
transactionsRoute.get("/:id", gettransactionCtrl);

//Delete/api/v1/transactions/:id
transactionsRoute.delete("/:id", deletetransactionCtrl);

//Put/api/v1/transactions/:id
transactionsRoute.put("/:id", updatetransactionCtrl);

module.exports = transactionsRoute;

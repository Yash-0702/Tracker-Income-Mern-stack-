const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const { AppErr } = require("../../utils/appErr");

//create
const createtransactionCtrl = async (req, res, next) => {
  const { name, amount, notes, transactionType, account, category } = req.body;
  try {
    //1.find the logged in user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      return res.json(next(new AppErr("User not found", 404)));
    }
    //2.find the account
    const accountFound = await Account.findById(account);
    if (!accountFound) {
      return res.json(next(new AppErr("Account not found", 404)));
    }
    //3.create transaction
    const transaction = await Transaction.create({
      name,
      amount,
      notes,
      transactionType,
      account,
      category,
      createdBy: req.user,
    });
    //4.push transaction to account
    accountFound.transactions.push(transaction._id);
    //5.resave the user
    await accountFound.save();
    res.json({
      status: "success",
      data: transaction,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//all
const gettransactionsCtrl = async (req, res, next) => {
  try {
    const trans = await Transaction.find();
    res.status(200).json({
      status: "success",
      data: trans,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//single
const gettransactionCtrl = async (req, res, next) => {
  try {
    const tran = await Transaction.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tran,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//delete
const deletetransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//update
const updatetransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tran = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: tran,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

module.exports = {
  createtransactionCtrl,
  gettransactionsCtrl,
  gettransactionCtrl,
  deletetransactionCtrl,
  updatetransactionCtrl,
};

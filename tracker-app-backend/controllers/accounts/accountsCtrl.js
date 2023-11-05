const Account = require("../../models/Account");
const User = require("../../models/User");
const { AppErr } = require("../../utils/appErr");

//create
const createAccountCtrl = async (req, res, next) => {
  const { name, accountType, initialBalance, notes } = req.body;
  try {
    //1.find the logged in user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      return res.json(next(new AppErr("User not found", 404)));
    }
    //2.create account
    const account = await Account.create({
      name,
      initialBalance,
      accountType,
      notes,
      createdBy: req.user,
    });
    //3.push account to user accounts field
    userFound.accounts.push(account._id);
    //4.resave the user
    await userFound.save();
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

//delete
const deleteAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Account.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//update
const updateAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//single
const getAccountCtrl = async (req, res, next) => {
  try {
    //find the id from params
    const { id } = req.params;
    const account = await Account.findById(id).populate("transactions");
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//all
const getAccountsCtrl = async (req, res, next) => {
  try {
    const accounts = await Account.find().populate("transactions");
    res.json(accounts);
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

module.exports = {
  createAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
  getAccountCtrl,
  getAccountsCtrl,
};

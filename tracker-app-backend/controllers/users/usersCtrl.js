const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { appErr, AppErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

//register
const registerUserCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    //check if email exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(new AppErr("User Already Exists", 400));
    }
    //check if feilds are empty
    if (!fullname || !email || !password) {
      return next(new AppErr("Please fill all the fields"));
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//login
const loginUserCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if email exists
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(new AppErr("Invalid Credentials", 400));
    }

    //check for password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return next(new AppErr("Invalid Credentials", 400));
    }

    res.json({
      status: "success",
      fullname: userFound.fullname,
      email: userFound.email,
      id: userFound._id,
      token: generateToken(userFound._id),
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//profile
const profileUserCtrl = async (req, res, next) => {
  // console.log(req.user);
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: { path: "transactions", model: "Transaction" },
    });
    res.json({
      user,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

//update
const updateUserCtrl = async (req, res, next) => {
  try {
    //check if email exists
    if (req.body.email) {
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound) {
        return next(new AppErr("Email is taken ", 400));
      }
    }

    //check if user is updating the password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //update password
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        { new: true, runValidators: true }
      );
      //send the response
      return res.status(200).json({
        status: "success",
        data: user,
      });
    }

    //update other fields
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });
    //send the response
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  profileUserCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};

const express = require("express");
const cors = require("cors");
require("./config/dbConnect.js");
const usersRoute = require("./routes/users/userRoutes");
const accountsRoute = require("./routes/accounts/accountRoutes");
const transactionRoute = require("./routes/transactions/transactionRoute");
const globalErrHandler = require("./middleware/globalErrHandler.js");

const app = express();

//middleware
app.use(express.json()); // pass incoming data

//cors middleware
app.use(cors());

//routes

//users routes
app.use("/api/v1/users", usersRoute);

//accounts routes
app.use("/api/v1/accounts", accountsRoute);

//transactions routes
app.use("/api/v1/transactions", transactionRoute);

//Error handlers
app.use(globalErrHandler);

//listen to server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

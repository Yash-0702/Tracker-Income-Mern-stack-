const mongoose = require("mongoose");

//connect

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yash:yash07@tracker.6cqlkga.mongodb.net/income-tracker-app?retryWrites=true&w=majority"
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri);
        console.log("DB connection succcessful");
    }
    catch(err) {
        console.error("Db connection falied due to : " , err.message);
        process.exit(1);
    }
};


module.exports = connectDB;
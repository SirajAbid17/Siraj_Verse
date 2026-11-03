const mongoose = require("mongoose");
require('dotenv').config();

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully!!!");
    } catch (error) {
        console.log(error, "DB not connected 😒");
        process.exit(1);
    }
}

module.exports = dbconnect;
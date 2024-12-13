// blog_app/config/db.js

const mongoose = require("mongoose");

function connectDB() {
    const url = "mongodb+srv://2017pushpakbhoite:Pushpak%40123@pushpakclusture-3.zy7cn.mongodb.net/formify";

    try {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
    return;
}


module.exports = connectDB;
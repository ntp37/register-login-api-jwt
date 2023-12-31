const mongoose = require('mongoose');

const { MONGO_URI } = process.env

// connect to database
exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.log("Error connecting to database");
        console.error(error);
        process.exit(1)
    })
}
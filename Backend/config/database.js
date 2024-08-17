const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then( ()=> {console.log("DB connection successful")})
    .catch( (err) => {
        console.log("error in database connection");
        console.error(err);
        process.exit(1);
    })
}

module.exports = dbConnect;

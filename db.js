const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://admin:passwordledu@naacloud.6z1jkgr.mongodb.net/tictactoe?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongo");
  });
};

module.exports = connectToMongo;

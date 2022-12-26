const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/game', require('./routes/game'))

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

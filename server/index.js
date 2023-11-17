const config = require("./config");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");

const uri =
  config.database.useConnectionString == true
    ? config.database.connectionString
    : `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.host}/?retryWrites=true&w=majority`;

const app = express();
app.use(express.json({ limit: config.api.maxPayload * 1000000 }));
app.use(rateLimit(config.rateLimit));

app.use(
  cors({
    origin: config.api.allowedOrigins,
  })
);
app.use("/", require("./routes"));
app.use(express.json());
app.use(compression());
app.use(morgan("combined"));

const connectionOptions = {
  dbName: config.database.dbName,
};

app.all("/", (req, res) => {
  res.status(200).send("Server up and runnin'");
});

async function connectToDb() {
  try {
    console.log("Connecting to database");

    await mongoose.connect(uri, connectionOptions);
    console.log("Connected");
    try {
      app.listen(config.api.port, () => {
        console.log(
          "API started on port " +
            config.api.port +
            " (http://localhost:" +
            config.api.port +
            ")"
        );
      });
    } catch (e) {
      console.log("Error while starting server");
    }
  } catch (e) {
    console.log("Error while connectiing to mongodb");
    console.error(e);
    console.log("Reconnecting...");
    connectToDb();
  }
}

connectToDb();

process.on("uncaughtException", function (err) {
  console.error(err);
});

module.exports = app;

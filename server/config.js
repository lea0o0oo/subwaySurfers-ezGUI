require("dotenv").config();

module.exports = {
  database: {
    useConnectionString: false, // TRUE: The app will connect using a specified connection string in the key 'connectionString' | FALSE: The app will manually "build" the connection string using given username, password and host.
    connectionString: process.env.MONGO_CONNECTION_STRING, // Will be ingored if useConnectionString is set to false.
    username: process.env.MONGO_USERNAME, // Will be ingored if useConnectionString is set to true
    password: process.env.MONGO_PASSWORD, // Will be ingored if useConnectionString is set to true
    host: process.env.MONGO_HOST, // Will be ingored if useConnectionString is set to true
    dbName: "main", // Database name
  },
  api: {
    port: 3002, // The port whene the api will be hosted
    allowedOrigins: "*", // Cors setting. Keep it like this
  },
  codes: {
    length: 6, // The length of the generated code. Example: 7FN4OP
  },
};

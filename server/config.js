require("dotenv").config();

module.exports = {
  bufferKey: [
    57, 114, 107, 120, 67, 80, 108, 106, 83, 77, 49, 71, 86, 81, 104, 87, 119,
    49, 114, 49, 114, 75, 79, 72, 71, 99, 99, 98, 50, 105, 74, 53,
  ], // The key used for encryption and decryption
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
    maxPayload: 0.1, // in mb
  },
  codes: {
    length: 6, // The length of the generated code. Example: 7FN4OP
  },
  rateLimit: {
    // Rate limiting settings
    windowMs: 720 * 60 * 1000, // 12 hours
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 12 hours).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  },
};

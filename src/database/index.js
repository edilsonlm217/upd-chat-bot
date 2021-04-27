const mongoose = require("mongoose");
const { databaseConfig } = require("../config/database");

class Database {
  async connect() {
    console.log('[LOG]: Connecting to mongo database');

    try {
      this.mongoConnection = await mongoose.connect(
        databaseConfig.mongodb_url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

      console.log(`[LOG]: Successfull connected`);
    } catch (error) {
      console.log(`[LOG]: Connection Error: ${error}`);
    }
  }
}

exports.Database = new Database();

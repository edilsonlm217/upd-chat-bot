import mongoose from 'mongoose';
import databaseConfig from '../config/database';

class Database {
  async start() {
    try {
      this.mongoConnection = await mongoose.connect(
        databaseConfig.mongodb_url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

      console.log('[LOG]: Successfull connected to mongo database');
    } catch (error) {
      console.log('[LOG]: Error connecting to mongo!');
    }
  }
}

export default new Database();

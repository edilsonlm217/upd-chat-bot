import mongoose from 'mongoose';
import databaseConfig from '../config/database';

class Database {
    constructor() {
        this.mongo();
    }

    mongo() {
        try {
            this.mongoConnection = mongoose.connect(
                databaseConfig.mongodb_url,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }
            );
        } catch (error) {
            console.error(`Connection Error: ${error}`);
        }
    }
}

export default new Database();

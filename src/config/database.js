const { MONGO_DB_AUTH_SOURCE, MONGO_DB_USER, MONGO_DB_PW, MONGO_DB_NAME } = process.env;
const mongoUrl = `mongodb://${MONGO_DB_USER}:${MONGO_DB_PW}@localhost:27017/${MONGO_DB_NAME}?authSource=${MONGO_DB_AUTH_SOURCE}&authMechanism=SCRAM-SHA-256&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

export default {
    mongodb_auth_source: MONGO_DB_AUTH_SOURCE,
    mongodb_url: mongoUrl,
    mongodb_user: MONGO_DB_USER,
    mongodb_password: MONGO_DB_PW,
};

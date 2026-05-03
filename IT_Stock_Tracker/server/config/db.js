const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

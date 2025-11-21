const mongoose = require("mongoose");

// MongoDB  connect  async function
const connectDB = async () => {
  try {
    // Local MongoDB connection string
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process if connection fails
  }
};
// Function ko export kar do taake server.js me use kar sakein
module.exports = connectDB;

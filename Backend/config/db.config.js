const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27019/CamTraDB';

const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("FATAL ERROR: MONGO_URI is not defined in the environment variables.");
        process.exit(1); 
    };
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB Connected successfully. Host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error:: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
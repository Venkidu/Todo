require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("📜 URI loaded from .env:", uri);
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully via Mongoose');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
  });

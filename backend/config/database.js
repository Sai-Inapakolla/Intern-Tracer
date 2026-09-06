const mongoose = require('mongoose');

async function connectDatabase(uri) {
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = { connectDatabase };

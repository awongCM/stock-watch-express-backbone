import mongoose from 'mongoose';

// Reusable singleton connection helper for Next.js (API routes / server components)
// Avoid multiple connections during dev hot reload.

let isConnecting = false;

export async function connectMongo(uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-watch') {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) {
    return new Promise((resolve) => {
      const check = () => {
        if (mongoose.connection.readyState === 1) resolve(mongoose.connection);
        else setTimeout(check, 50);
      };
      check();
    });
  }
  isConnecting = true;
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || 'stock-watch'
  });
  isConnecting = false;
  return mongoose.connection;
}

// Example Stock schema placeholder (aligns with legacy models/stock.js)
// Extend later for actual CRUD or portfolio features.
const stockSchema = new mongoose.Schema({
  name: String,
  description: String,
  units: Number,
  value: Number,
  profit_loss: Number,
  created_at: Date,
  updated_at: Date,
  currency: String
});

export const StockModel = mongoose.models.Stock || mongoose.model('Stock', stockSchema);

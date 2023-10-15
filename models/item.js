import mongoose from "mongoose";

// Define the schema for the inventory item
const itemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  lastUpdatedTimestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the item schema
export const Item = mongoose.model('Item', itemSchema);

// Define the schema for the transaction
const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Item model
    ref: 'Item',
    required: true,
  },
  type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  transactionTimestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the transaction schema
export const Transaction = mongoose.model('Transaction', transactionSchema);



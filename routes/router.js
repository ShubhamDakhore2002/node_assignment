import express from "express";
const router = express.Router();
import { Item, Transaction } from "../models/item"; // Import your Mongoose models
import { body, validationResult } from "express-validator";

// Items API
// Retrieve a list of all items
router.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
});

// Add a new item to the inventory
router.post(
  "/items",
  body("id").isString().notEmpty(),
  body("name").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("quantity").isInt().notEmpty(),
  async (req, res) => {
    try {
      const newItem = new Item(req.body);
      // Check if the transaction quantity is negative
      if (newItem.quantity < 0) {
        return res.status(400).json({ error: "Negative quantity not allowed" });
      }
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

// Retrieve a specific item by its id
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(item);
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving the item" });
  }
});

// Update a specific item by its id
router.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the item" });
  }
});

// Remove a specific item from the inventory
router.delete(
  "/items/:id",
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("quantity").isInt().optional(),
  async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndRemove(req.params.id);
      if (!deletedItem) {
        res.status(404).json({ error: "Item not found" });
      } else {
        res.json(deletedItem);
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting the item" });
    }
  }
);

// Transactions API
// Record a transaction for a specific item
router.post(
  "/items/transaction/:id",
  body("type").isIn(["IN", "OUT"]),
  body("quantity").isInt().notEmpty(),
  async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      console.log("Got it");
      if (!item) {
        res.status(404).json({ error: "Item not found" });
      } else {
        const transactionData = { itemId: req.params.id, ...req.body };
        const newTransaction = new Transaction(transactionData);
        console.log(newTransaction);
        // Check if the transaction quantity is negative
        if (newTransaction.quantity < 0) {
          return res
            .status(400)
            .json({ error: "Negative quantity not allowed" });
        }
        const savedTransaction = await newTransaction.save();
        console.log("Got it again");
        res.status(201).json(savedTransaction);
      }
    } catch (error) {
      res.status(500).json({ error: "Error recording the transaction" });
    }
  }
);

// Retrieve all transactions for a specific item
router.get("/items/transactions/:id", async (req, res) => {
  try {
    const transactions = await Transaction.find({ itemId: req.params.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving transactions" });
  }
});

export default router;

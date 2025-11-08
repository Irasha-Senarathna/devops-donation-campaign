import Item from '../models/Item.js';

// Create new item
export const createItem = async (req, res) => {
  try {
    const { title, description = '', amount } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    const item = await Item.create({
      title,
      description,
      amount,
      createdBy: req.user.id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('createItem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all items for current user
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('getItems error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('getItem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { title, description, amount } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (amount !== undefined) update.amount = amount;

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: update },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('updateItem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteItem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

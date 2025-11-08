import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../controllers/itemController.js';

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

router.post('/', createItem); // Create
router.get('/', getItems); // List
router.get('/:id', getItem); // Read one
router.put('/:id', updateItem); // Update
router.delete('/:id', deleteItem); // Delete

export default router;

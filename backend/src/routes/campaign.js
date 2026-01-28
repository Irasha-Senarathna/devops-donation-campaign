import express from 'express';
import Campaign from '../models/Campaign.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

// Get all campaigns
router.get('/', async (req, res) => {
  const campaigns = await Campaign.find().populate('creator', 'name');
  res.json(campaigns);
});

// Create campaign
router.post('/', protect, async (req, res) => {
  const { title, description, image, targetAmount } = req.body;
  const campaign = await Campaign.create({ title, description, image, targetAmount, creator: req.userId });
  res.status(201).json(await campaign.populate('creator', 'name'));
});

// Update campaign
router.put('/:id', protect, async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  if (campaign.creator.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });

  Object.assign(campaign, req.body);
  await campaign.save();
  res.json(await campaign.populate('creator', 'name'));
});

// Delete campaign
router.delete('/:id', protect, async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  if (campaign.creator.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });

  await campaign.remove();
  res.json({ message: 'Campaign removed' });
});

// Donate to campaign
router.post('/:id/donate', protect, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid donation amount' });

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

  const collected = campaign.donations.reduce((sum, d) => sum + d.amount, 0);
  if (collected + amount > campaign.targetAmount) {
    return res.status(400).json({ message: 'Donation exceeds target amount' });
  }

  campaign.donations.push({ user: req.userId, amount });
  await campaign.save();

  res.json(await campaign.populate('creator', 'name'));
});

export default router;

import mongoose from 'mongoose';

// Campaign.js (mongoose schema)
const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  targetAmount: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donations: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


export default mongoose.model('Campaign', campaignSchema);

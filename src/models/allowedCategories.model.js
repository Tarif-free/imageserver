import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema({
  allowedCategories: {
    type: [String],
    required: true,
    enum: ['mobile', 'tree', 'house', 'mountain', 'man', 'woman'], // Predefined categories
  },
});

export const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

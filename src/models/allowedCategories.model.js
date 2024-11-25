
import mongoose from 'mongoose';

const appConfigSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
    unique: true,
  },
  allowedCategories: {
    type: [String],
    required: true,
    
  },
});

export const AppConfig = mongoose.model('AppConfig', appConfigSchema);


import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  downloadCount: { 
    type: Number, 
    default: 0 
  },
  expiresAt: { 
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7); // 7 días por defecto
      return date;
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  accessCode: {
    type: String,
    default: null
  }
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File; 
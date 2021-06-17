import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    option: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    owner_id: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: false,
  }
);

export default mongoose.model('Message', MessageSchema);

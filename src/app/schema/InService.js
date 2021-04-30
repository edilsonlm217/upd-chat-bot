import mongoose from 'mongoose';

const InServiceSchema = new mongoose.Schema(
  {
    protocolNumber: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    lastMessageReceivedAt: {
      type: Date,
      required: true,
    },
    stage: {
      type: Number,
      default: 0,
    },
    serviceType: {
      type: String,
      default: 'detached',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InService', InServiceSchema);
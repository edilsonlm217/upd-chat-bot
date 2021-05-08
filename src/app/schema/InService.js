import mongoose from 'mongoose';

const InServiceSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: false,
    },
    protocolNumber: {
      type: String,
      default: 12456489712345, // TODO: Criar um número de protocolo significativo
    },
    stage: {
      type: Number,
      default: 0,
    },
    menuStage: {
      type: String,
      default: "principal",
    },
    lastMessageReceivedAt: {
      type: Date,
      required: false,
    },
    ageInMinutes: {
      type: Number,
      default: 0,
    },
    serviceType: {
      type: String,
      default: 'detached',
    },
    senderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InService', InServiceSchema);
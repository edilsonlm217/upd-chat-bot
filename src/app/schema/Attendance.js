import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    sessionName: {
      type: String,
      required: true,
    },
    protocolNumber: {
      type: String,
      default: 12456489712345, // TODO: Criar um número de protocolo significativo
    },
    stage: {
      type: String,
      default: 'welcome',
    },
    lastMessageReceivedAt: {
      type: Date,
      default: new Date(),
    },
    client: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Attendance', AttendanceSchema);
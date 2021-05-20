import mongoose from 'mongoose';
import { format } from 'date-fns';

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
      default: format(new Date(), 'ddMMyyhhmmssSS'),
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
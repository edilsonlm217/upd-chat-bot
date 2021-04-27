const mongoose = require('mongoose');

const InService = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

exports.InService = mongoose.model('InService', InService);

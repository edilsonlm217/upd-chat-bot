import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    cnpj: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    login: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dbHost: {
      type: String,
      required: true,
    },
    dbPort: {
      type: String,
      required: true,
    },
    dbUsername: {
      type: String,
      default: 'updata',
    },
    dbPassword: {
      type: String,
      default: 'Falcon31',
    },
    dbName: {
      type: String,
      default: 'mkradius',
    },
    sessionName: {
      type: String,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Tenant', TenantSchema);

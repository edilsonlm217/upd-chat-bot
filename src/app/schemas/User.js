import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cnpj: {
            type: String,
            required: true,
        },
        sessionName: {
            type: String,
            required: true,
        },
        login: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', UserSchema);

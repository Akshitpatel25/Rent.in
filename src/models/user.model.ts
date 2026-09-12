import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isGoogleSignedIn: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    whatsapp_numbers: {
        type: [String],
        default: [],
        validate: {
            validator: function(v: string[]) {
                return v.length <= 3;
            },
            message: "Maximum 3 WhatsApp numbers allowed"
        }
    }
})

const User = mongoose.models.Users || mongoose.model('Users', UserSchema);
export default User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');

const { Schema } = mongoose;
const signJwt = util.promisify(jwt.sign);

const ROLES = ['Admin', 'Chauffeur'];

const userSchema = new Schema(
    {
        firstName: { 
            type: String,
            required: true,
            trim: true 
        },
        lastName: { 
            type: String, 
            required: true,
            trim: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            trim: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            required: true, 
            enum: ROLES 
        },
        isActive: { 
            type: Boolean, 
            default: true 
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return ;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return new Error(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    const secret = process.env.JWT_ACCESS_SECRET;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
    if (!secret) {
        throw new Error('JWT access secret is not configured');
    }

    return signJwt(
        { 
            id: this._id.toString(), 
            role: this.role 
        },
        secret,
        expiresIn ? { expiresIn } : undefined
    );
};

userSchema.methods.generateRefreshToken = async function () {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    if (!secret) {
        throw new Error('JWT refresh secret is not configured');
    }

    return signJwt(
        { 
            id: this._id.toString(), 
            role: this.role 
        },
        secret,
        expiresIn ? { expiresIn } : undefined
    );
};

module.exports = mongoose.model('User', userSchema);


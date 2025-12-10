const mongoose = require('mongoose');

const { Schema } = mongoose;

const trailerSchema = new Schema(
    {
        immatriculation: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        marque: {
            type: String,
            required: true
        },
        modele: {
            type: String,
            required: true
        },
        acquisitionDate: {
            type: Date,
            required: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        lastMaintenanceDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Trailer', trailerSchema);


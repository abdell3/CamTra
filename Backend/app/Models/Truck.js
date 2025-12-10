const mongoose = require('mongoose');

const { Schema } = mongoose;

const truckSchema = new Schema(
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
        currentKm: {
            type: Number,
            required: true,
            default: 0
        },
        engineHours: {
            type: Number,
            default: 0
        },
        lastMaintenanceKm: {
            type: Number,
            default: 0
        },
        lastMaintenanceDate: {
            type: Date,
            default: null
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Truck', truckSchema); 


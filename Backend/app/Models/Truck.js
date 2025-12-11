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
        brand: {
            type: String,
            required: true
        },
        model: {
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

truckSchema.methods.calculateRemainingKm = function (maintenanceRule) {
    if (!maintenanceRule || !maintenanceRule.periodKm) {
        throw new Error('Maintenance rule with periodKm is required');
    }

    const lastMaintenanceKm = this.lastMaintenanceKm || 0;
    const kmSinceLastMaintenance = this.currentKm - lastMaintenanceKm;
    const remainingKm = maintenanceRule.periodKm - kmSinceLastMaintenance;

    return remainingKm;
};

truckSchema.methods.isDueForService = function (maintenanceRule) {
    const remainingKm = this.calculateRemainingKm(maintenanceRule);
    return remainingKm <= 0;
};

module.exports = mongoose.model('Truck', truckSchema); 


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

trailerSchema.methods.calculateRemainingDays = function (maintenanceRule) {
    if (!maintenanceRule || !maintenanceRule.periodMonths) {
        throw new Error('Maintenance rule with periodMonths is required');
    }

    if (!this.lastMaintenanceDate) {
        return null;
    }

    const today = new Date();
    const lastMaintenance = new Date(this.lastMaintenanceDate);
    const monthsToAdd = maintenanceRule.periodMonths;

    let nextMaintenanceDate;
    if (typeof monthsToAdd === 'number') {
        nextMaintenanceDate = new Date(lastMaintenance);
        nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + monthsToAdd);
    } else {
        throw new Error('intervalTime must be a number (months)');
    }

    const diffTime = nextMaintenanceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

trailerSchema.methods.isDueForService = function (maintenanceRule) {
    const remainingDays = this.calculateRemainingDays(maintenanceRule);
    if (remainingDays === null) {
        return false;
    }
    return remainingDays <= 0;
};

module.exports = mongoose.model('Trailer', trailerSchema);


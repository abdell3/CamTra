const mongoose = require('mongoose');

const { Schema } = mongoose;

const TIRE_STATUS = ['Neuf', 'Bon', 'Use', 'Critique', 'Reforme'];

const tireSchema = new Schema(
    {
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: TIRE_STATUS,
            default: 'Neuf',
        },
        purchaseDate: {
            type: Date,
            required: true,
        },
        mountedOnEntity: {
            type: Schema.Types.ObjectId,
            refPath: 'mountedOnModel',
            default: null,
        },
        mountedOnModel: {
            type: String,
            enum: ['Truck', 'Trailer'],
            default: null,
        },
        mountedAtKm: {
            type: Number,
            default: 0,
        },
        totalKmDriven: {
            type: Number,
            default: 0,
        },
        position: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

tireSchema.pre('validate', function (next) {
    const hasEntity = !!this.mountedOnEntity;
    const hasModel = !!this.mountedOnModel;

    if (hasEntity && !hasModel) {
        return next(new Error('mountedOnModel is required when mountedOnEntity is set'));
    }

    if (!hasEntity && hasModel) {
        return next(new Error('mountedOnModel must be null when mountedOnEntity is null'));
    }

    return next();
});

tireSchema.methods.getKmDriven = function (currentEntityKm) {
    if (typeof currentEntityKm !== 'number' || Number.isNaN(currentEntityKm)) {
        throw new Error('currentEntityKm must be a valid number');
    }
    if (currentEntityKm < this.mountedAtKm) {
        return 0;
    }
    return currentEntityKm - this.mountedAtKm;
};

module.exports = mongoose.model('Tire', tireSchema);


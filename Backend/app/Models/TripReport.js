const mongoose = require('mongoose');

const { Schema } = mongoose;

const tripReportSchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: 'Trip',
            required: true,
            unique: true,
        },
        startKmReading: {
            type: Number,
            required: true,
        },
        endKmReading: {
            type: Number,
            required: true,
        },
        gasoilVolumeFilled: {
            type: Number,
            default: 0,
        },
        driverRemarks: {
            type: String,
        },
        validatedByAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tripReportSchema.virtual('distance').get(function () {
    return this.endKmReading - this.startKmReading;
});

tripReportSchema.virtual('consumption').get(function () {
    const distance = this.endKmReading - this.startKmReading;
    if (distance === 0) {
        return 0;
    }
    return (this.gasoilVolumeFilled / distance) * 100;
});

tripReportSchema.pre('validate', async function () {
    if (this.endKmReading < this.startKmReading) {
        throw new Error('endKmReading must be greater than or equal to startKmReading');
    }
});

module.exports = mongoose.model('TripReport', tripReportSchema);

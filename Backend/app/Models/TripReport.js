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
    }
);

tripReportSchema.pre('validate', function (next) {
    if (this.endKmReading < this.startKmReading) {
        throw new Error('endKmReading must be greater than or equal to startKmReading');
    }
    next();
});

module.exports = mongoose.model('TripReport', tripReportSchema);

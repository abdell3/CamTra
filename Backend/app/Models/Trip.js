const mongoose = require('mongoose');

const { Schema } = mongoose;

const TRIP_STATUS = ['Planned', 'InProgress', 'Completed', 'Cancelled'];

const tripSchema = new Schema(
    {
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        truck: {
            type: Schema.Types.ObjectId,
            ref: 'Truck',
            required: true,
        },
        trailer: {
            type: Schema.Types.ObjectId,
            ref: 'Trailer',
            default: null,
        },
        departurePlace: {
            type: String,
            required: true,
            trim: true,
        },
        arrivalPlace: {
            type: String,
            required: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: TRIP_STATUS,
            default: 'Planned',
        },
        startKm: {
            type: Number,
            required: true,
        },
        endKm: {
            type: Number,
            default: null,
        },
        fuelVolume: {
            type: Number,
            default: null,
        },
        comments: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

tripSchema.pre('validate', function (next) {
    if (this.endDate && this.startDate && this.endDate <= this.startDate) {
        throw new Error('endDate must be after startDate');
    }
});

module.exports = mongoose.model('Trip', tripSchema);


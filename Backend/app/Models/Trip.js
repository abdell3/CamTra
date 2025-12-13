const mongoose = require('mongoose');

const { Schema } = mongoose;

const TRIP_STATUS = ['Planned', 'InProgress', 'Completed', 'Cancelled'];

const tripSchema = new Schema(
    {
        assignedDriverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTruckId: {
            type: Schema.Types.ObjectId,
            ref: 'Truck',
            required: true,
        },
        assignedTrailerId: {
            type: Schema.Types.ObjectId,
            ref: 'Trailer',
            default: null,
        },
        departureSite: {
            type: String,
            required: true,
            trim: true,
        },
        arrivalSite: {
            type: String,
            required: true,
            trim: true,
        },
        plannedStartDate: {
            type: Date,
            required: true,
        },
        plannedEndDate: {
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
    },
    {
        timestamps: true,
    }
);

tripSchema.pre('validate', async function () {
    if (this.plannedEndDate && this.plannedStartDate && this.plannedEndDate <= this.plannedStartDate) {
        throw new Error('plannedEndDate must be after plannedStartDate');
    }
});

module.exports = mongoose.model('Trip', tripSchema);


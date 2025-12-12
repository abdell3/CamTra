const mongoose = require('mongoose');

const { Schema } = mongoose;

const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const ENTITY_TYPES = ['Truck', 'Trailer'];

const maintenanceRuleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        targetEntityType: {
            type: String,
            enum: ENTITY_TYPES,
            required: true,
        },
        severity: {
            type: String,
            enum: SEVERITY_LEVELS,
            default: 'Medium',
        },
        periodKm: {
            type: Number,
            default: null,
        },
        periodMonths: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

maintenanceRuleSchema.pre('validate', function (next) {
    const hasPeriodKm = this.periodKm !== null && this.periodKm !== undefined;
    const hasPeriodMonths = this.periodMonths !== null && this.periodMonths !== undefined;

    if (this.targetEntityType === 'Trailer') {
        if (hasPeriodKm) {
            return next(new Error('Trailer maintenance rule cannot have periodKm. Trailers do not track maintenance by kilometers.'));
        }
        if (!hasPeriodMonths) {
            return next(new Error('Trailer maintenance rule must have periodMonths.'));
        }
    }

    if (this.targetEntityType === 'Truck') {
        if (!hasPeriodKm && !hasPeriodMonths) {
            return next(new Error('Truck maintenance rule must have at least periodKm or periodMonths.'));
        }
    }

    if (!hasPeriodKm && !hasPeriodMonths) {
        return next(new Error('Maintenance rule must have at least periodKm or periodMonths.'));
    }

    return next();
});

maintenanceRuleSchema.methods.getDueDate = function (lastMaintenanceDate, lastMaintenanceKm) {
    if (this.periodMonths && lastMaintenanceDate) {
        const lastMaintenance = new Date(lastMaintenanceDate);
        const nextMaintenanceDate = new Date(lastMaintenance);
        nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + this.periodMonths);
        return nextMaintenanceDate;
    }
    return null;
};

module.exports = mongoose.model('MaintenanceRule', maintenanceRuleSchema);




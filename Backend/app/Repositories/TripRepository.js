const BaseRepository = require('./BaseRepository');

class TripRepository extends BaseRepository {
    constructor(TripModel) {
        super(TripModel);
    }

    async findActiveTripsByDriver(driverId) {
        return this.model
            .find({
                assignedDriverId: driverId,
                status: { $in: ['Planned', 'InProgress'] },
            })
            .populate('assignedTruckId')
            .populate('assignedTrailerId');
    }

    async findAllByDriver(driverId) {
        return this.model
            .find({
                assignedDriverId: driverId,
                status: { $ne: 'Cancelled' },
            })
            .sort({ plannedStartDate: 1 })
            .populate('assignedTruckId')
            .populate('assignedTrailerId');
    }
}

module.exports = TripRepository;


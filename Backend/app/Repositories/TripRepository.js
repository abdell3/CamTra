const BaseRepository = require('./BaseRepository');

class TripRepository extends BaseRepository {
    constructor(TripModel) {
        super(TripModel);
    }

    async findActiveTripsByDriver(driverId) {
        return this.model
            .find({
                driver: driverId,
                status: { $in: ['Planned', 'InProgress'] },
            })
            .populate('truck')
            .populate('trailer');
    }
}

module.exports = TripRepository;


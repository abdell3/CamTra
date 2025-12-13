const BaseRepository = require('./BaseRepository');

class TripReportRepository extends BaseRepository {
    constructor(TripReportModel) {
        super(TripReportModel);
    }

    async findByTripId(tripId) {
        return this.model.findOne({ tripId }).populate('tripId');
    }
}

module.exports = TripReportRepository;

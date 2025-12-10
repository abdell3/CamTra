const BaseRepository = require('./BaseRepository');

class TruckRepository extends BaseRepository {
    constructor(TruckModel) {
        super(TruckModel);
    }
}

module.exports = TruckRepository;


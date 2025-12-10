const BaseRepository = require('./BaseRepository');

class TrailerRepository extends BaseRepository {
    constructor(TrailerModel) {
        super(TrailerModel);
    }
}

module.exports = TrailerRepository;


const BaseRepository = require('./BaseRepository');

class TrailerRepository extends BaseRepository {
    constructor(TrailerModel) {
        super(TrailerModel);
    }

    async update(id, data) {
        const doc = await this.model.findById(id);
        if (!doc) {
            return null;
        }
        doc.set(data);
        return await doc.save();
    }
}

module.exports = TrailerRepository;


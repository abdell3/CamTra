const BaseRepository = require('./BaseRepository');

class TruckRepository extends BaseRepository {
    constructor(TruckModel) {
        super(TruckModel);
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

module.exports = TruckRepository;


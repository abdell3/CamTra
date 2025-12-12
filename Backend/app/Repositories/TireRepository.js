const BaseRepository = require('./BaseRepository');

class TireRepository extends BaseRepository {
    constructor(TireModel) {
        super(TireModel);
    }

    async findByEntity(entityId, entityModel) {
        return this.model.find({
            mountedOnEntity: entityId,
            mountedOnModel: entityModel,
        });
    }
}

module.exports = TireRepository;


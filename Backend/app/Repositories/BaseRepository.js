class BaseRepository {
    constructor(model) {
        if (!model) {
            throw new Error('Model dependency is required');
        }
        this.model = model;
    }

    async create(payload) {
        return this.model.create(payload);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(
            id, 
            data, 
            { 
                new: true, 
                runValidators: true 
            }
        );
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;


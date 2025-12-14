class TrailerService {
    constructor(trailerRepository) {
        if (!trailerRepository) {
            throw new Error('TrailerRepository dependency is required');
        }
        this.trailerRepository = trailerRepository;
    }

    async create(data) {
        return this.trailerRepository.create(data);
    }

    async getAll() {
        return this.trailerRepository.model.find({});
    }

    async getById(id) {
        const trailer = await this.trailerRepository.findById(id);
        if (!trailer) {
            const error = new Error('Trailer not found');
            error.status = 404;
            throw error;
        }
        return trailer;
    }

    async update(id, data) {
        const existing = await this.trailerRepository.findById(id);
        if (!existing) {
            const error = new Error('Trailer not found');
            error.status = 404;
            throw error;
        }
        return this.trailerRepository.update(id, data);
    }

    async delete(id) {
        const existing = await this.trailerRepository.findById(id);
        if (!existing) {
            const error = new Error('Trailer not found');
            error.status = 404;
            throw error;
        }
        return this.trailerRepository.delete(id);
    }
}

module.exports = TrailerService;


class TruckService {
    constructor(truckRepository) {
        if (!truckRepository) {
            throw new Error('TruckRepository dependency is required');
        }
        this.truckRepository = truckRepository;
    }

    async create(data) {
        return this.truckRepository.create(data);
    }

    async getAll() {
        return this.truckRepository.model.find({});
    }

    async getById(id) {
        const truck = await this.truckRepository.findById(id);
        if (!truck) {
            const error = new Error('Truck not found');
            error.status = 404;
            throw error;
        }
        return truck;
    }

    async update(id, data) {
        const existing = await this.truckRepository.findById(id);
        if (!existing) {
            const error = new Error('Truck not found');
            error.status = 404;
            throw error;
        }
        return this.truckRepository.update(id, data);
    }

    async delete(id) {
        const existing = await this.truckRepository.findById(id);
        if (!existing) {
            const error = new Error('Truck not found');
            error.status = 404;
            throw error;
        }
        return this.truckRepository.delete(id);
    }
}

module.exports = TruckService;


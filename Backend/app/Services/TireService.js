class TireService {
    constructor(tireRepository, truckRepository, trailerRepository) {
        if (!tireRepository || !truckRepository || !trailerRepository) {
            throw new Error('TireService requires TireRepository, TruckRepository and TrailerRepository dependencies');
        }
        this.tireRepository = tireRepository;
        this.truckRepository = truckRepository;
        this.trailerRepository = trailerRepository;
    }

    async create(data) {
        return this.tireRepository.create(data);
    }

    async getAll() {
        return this.tireRepository.model.find({});
    }

    async getById(id) {
        const tire = await this.tireRepository.findById(id);
        if (!tire) {
            const error = new Error('Tire not found');
            error.status = 404;
            throw error;
        }
        return tire;
    }

    async delete(id) {
        const existing = await this.tireRepository.findById(id);
        if (!existing) {
            const error = new Error('Tire not found');
            error.status = 404;
            throw error;
        }
        return this.tireRepository.delete(id);
    }

    async mountTire(tireId, vehicleId, vehicleType, position) {
        const tire = await this.tireRepository.findById(tireId);
        if (!tire) {
            const error = new Error('Tire not found');
            error.status = 404;
            throw error;
        }

        if (tire.status === 'Reforme') {
            const error = new Error('Cannot mount a tire with status "Reforme"');
            error.status = 400;
            throw error;
        }

        if (tire.mountedOnEntity) {
            const error = new Error('Tire is already mounted on a vehicle');
            error.status = 400;
            throw error;
        }

        let vehicle;
        let vehicleName;

        if (vehicleType === 'Truck') {
            vehicle = await this.truckRepository.findById(vehicleId);
            vehicleName = 'Truck';
        } else if (vehicleType === 'Trailer') {
            vehicle = await this.trailerRepository.findById(vehicleId);
            vehicleName = 'Trailer';
        } else {
            const error = new Error('Invalid vehicle type. Must be "Truck" or "Trailer"');
            error.status = 400;
            throw error;
        }

        if (!vehicle) {
            const error = new Error(`${vehicleName} not found`);
            error.status = 404;
            throw error;
        }

        const mountedAtKm = vehicle.currentKm || 0;

        const updateData = {
            mountedOnEntity: vehicleId,
            mountedOnModel: vehicleType,
            position: position,
            mountedAtKm: mountedAtKm,
            status: tire.status === 'Neuf' ? 'Bon' : tire.status,
        };

        return this.tireRepository.update(tireId, updateData);
    }

    async dismountTire(tireId) {
        const tire = await this.tireRepository.findById(tireId);
        if (!tire) {
            const error = new Error('Tire not found');
            error.status = 404;
            throw error;
        }

        if (!tire.mountedOnEntity || !tire.mountedOnModel) {
            const error = new Error('Tire is not mounted on any vehicle');
            error.status = 400;
            throw error;
        }

        let vehicle;
        if (tire.mountedOnModel === 'Truck') {
            vehicle = await this.truckRepository.findById(tire.mountedOnEntity);
        } else if (tire.mountedOnModel === 'Trailer') {
            vehicle = await this.trailerRepository.findById(tire.mountedOnEntity);
        }

        if (!vehicle) {
            const error = new Error('Vehicle not found');
            error.status = 404;
            throw error;
        }

        const sessionKm = tire.getKmDriven(vehicle.currentKm);
        const currentTotalKm = tire.totalKmDriven || 0;
        const newTotalKm = currentTotalKm + sessionKm;

        const updateData = {
            mountedOnEntity: null,
            mountedOnModel: null,
            position: null,
            mountedAtKm: 0,
            totalKmDriven: newTotalKm,
        };

        return this.tireRepository.update(tireId, updateData);
    }
}

module.exports = TireService;


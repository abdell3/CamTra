class TripService {
    constructor(tripRepository, userRepository, truckRepository, trailerRepository) {
        if (!tripRepository || !userRepository || !truckRepository || !trailerRepository) {
            throw new Error('TripService requires TripRepository, UserRepository, TruckRepository, TrailerRepository');
        }
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.truckRepository = truckRepository;
        this.trailerRepository = trailerRepository;
    }

    async createTrip(data) {
        const { driver, truck, trailer } = data;

        const user = await this.userRepository.findById(driver);
        if (!user) {
            const error = new Error('Driver not found');
            error.status = 404;
            throw error;
        }
        if (user.role !== 'Chauffeur') {
            const error = new Error('User is not a driver');
            error.status = 400;
            throw error;
        }

        const activeTrips = await this.tripRepository.findActiveTripsByDriver(driver);
        if (activeTrips && activeTrips.length > 0) {
            const error = new Error('Driver already has an active trip');
            error.status = 400;
            throw error;
        }

        const truckEntity = await this.truckRepository.findById(truck);
        if (!truckEntity) {
            const error = new Error('Truck not found');
            error.status = 404;
            throw error;
        }
        if (!truckEntity.isAvailable) {
            const error = new Error('Truck is not available');
            error.status = 400;
            throw error;
        }

        let trailerEntity = null;
        if (trailer) {
            trailerEntity = await this.trailerRepository.findById(trailer);
            if (!trailerEntity) {
                const error = new Error('Trailer not found');
                error.status = 404;
                throw error;
            }
            if (!trailerEntity.isAvailable) {
                const error = new Error('Trailer is not available');
                error.status = 400;
                throw error;
            }
        }

        const tripPayload = {
            ...data,
            status: 'Planned',
            startKm: truckEntity.currentKm || 0,
        };

        const trip = await this.tripRepository.create(tripPayload);

        await this.truckRepository.update(truckEntity._id, { isAvailable: false });
        if (trailerEntity) {
            await this.trailerRepository.update(trailerEntity._id, { isAvailable: false });
        }

        return trip;
    }

    async getAll() {
        return this.tripRepository.model
            .find({})
            .populate('driver')
            .populate('truck')
            .populate('trailer');
    }

    async update(id, data) {
        const trip = await this.tripRepository.findById(id);
        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            throw error;
        }

        const forbiddenFields = ['driver', 'truck', 'trailer'];
        const updateData = { ...data };
        forbiddenFields.forEach((field) => {
            if (field in updateData) {
                delete updateData[field];
            }
        });

        return this.tripRepository.update(id, updateData);
    }

    async delete(id) {
        const trip = await this.tripRepository.model
            .findById(id)
            .populate('truck')
            .populate('trailer');

        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            throw error;
        }

        if (trip.truck) {
            await this.truckRepository.update(trip.truck._id, { isAvailable: true });
        }
        if (trip.trailer) {
            await this.trailerRepository.update(trip.trailer._id, { isAvailable: true });
        }

        return this.tripRepository.delete(id);
    }
}

module.exports = TripService;


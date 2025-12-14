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
        const assignedDriverId = (data.assignedDriverId || data.driver)?.toString().trim();
        const assignedTruckId = (data.assignedTruckId || data.truck)?.toString().trim();
        const assignedTrailerId = (data.assignedTrailerId || data.trailer)?.toString().trim() || null;
        const departureSite = data.departureSite || data.departurePlace;
        const arrivalSite = data.arrivalSite || data.arrivalPlace;
        const plannedStartDate = data.plannedStartDate || data.startDate;
        const plannedEndDate = data.plannedEndDate || data.endDate;

        const user = await this.userRepository.findById(assignedDriverId);
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

        const activeTrips = await this.tripRepository.findActiveTripsByDriver(assignedDriverId);
        if (activeTrips && activeTrips.length > 0) {
            const error = new Error('Driver already has an active trip');
            error.status = 400;
            throw error;
        }

        const truckEntity = await this.truckRepository.findById(assignedTruckId);
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
        if (assignedTrailerId) {
            trailerEntity = await this.trailerRepository.findById(assignedTrailerId);
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
            assignedDriverId,
            assignedTruckId,
            assignedTrailerId,
            departureSite,
            arrivalSite,
            plannedStartDate,
            plannedEndDate,
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
            .populate('assignedDriverId')
            .populate('assignedTruckId')
            .populate('assignedTrailerId');
    }

    async getDriverTrips(driverId) {
        return this.tripRepository.findAllByDriver(driverId);
    }

    async startTrip(tripId, driverId) {
        const trip = await this.tripRepository.findById(tripId);
        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            throw error;
        }

        if (trip.assignedDriverId.toString() !== driverId) {
            const error = new Error('Unauthorized: You are not the assigned driver for this trip');
            error.status = 403;
            throw error;
        }

        if (!trip.canBeStarted()) {
            const error = new Error('Trip cannot be started. It must be in Planned status');
            error.status = 400;
            throw error;
        }

        return this.tripRepository.update(tripId, { status: 'InProgress' });
    }

    async update(id, data) {
        const trip = await this.tripRepository.findById(id);
        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            throw error;
        }

        const forbiddenFields = ['assignedDriverId', 'assignedTruckId', 'assignedTrailerId'];
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
            .populate('assignedTruckId')
            .populate('assignedTrailerId');

        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            throw error;
        }

        if (trip.assignedTruckId) {
            await this.truckRepository.update(trip.assignedTruckId._id, { isAvailable: true });
        }
        if (trip.assignedTrailerId) {
            await this.trailerRepository.update(trip.assignedTrailerId._id, { isAvailable: true });
        }

        return this.tripRepository.delete(id);
    }
}

module.exports = TripService;


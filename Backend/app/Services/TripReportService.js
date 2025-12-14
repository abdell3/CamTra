class TripReportService {
    constructor(tripReportRepository, tripRepository, truckRepository, trailerRepository) {
        if (!tripReportRepository || !tripRepository || !truckRepository || !trailerRepository) {
            throw new Error('TripReportService requires TripReportRepository, TripRepository, TruckRepository, TrailerRepository');
        }
        this.tripReportRepository = tripReportRepository;
        this.tripRepository = tripRepository;
        this.truckRepository = truckRepository;
        this.trailerRepository = trailerRepository;
    }

    async createReport(data, driverId) {
        const { tripId, startKmReading, endKmReading, gasoilVolumeFilled, driverRemarks } = data;

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

        if (trip.status !== 'InProgress') {
            const error = new Error('Trip must be InProgress to create a report');
            error.status = 400;
            throw error;
        }

        if (endKmReading < startKmReading) {
            const error = new Error('endKmReading must be greater than or equal to startKmReading');
            error.status = 400;
            throw error;
        }

        const existingReport = await this.tripReportRepository.findByTripId(tripId);
        if (existingReport) {
            const error = new Error('A report already exists for this trip');
            error.status = 400;
            throw error;
        }

        const reportData = {
            tripId,
            startKmReading,
            endKmReading,
            gasoilVolumeFilled: gasoilVolumeFilled || 0,
            driverRemarks: driverRemarks || null,
            validatedByAdmin: false,
        };

        const report = await this.tripReportRepository.create(reportData);

        await this.tripRepository.update(tripId, { status: 'Completed' });

        await this.truckRepository.update(trip.assignedTruckId, { 
            currentKm: endKmReading,
            isAvailable: true 
        });

        if (trip.assignedTrailerId) {
            await this.trailerRepository.update(trip.assignedTrailerId, { 
                isAvailable: true 
            });
        }

        return report;
    }

    async getAll() {
        return this.tripReportRepository.model
            .find({})
            .populate('tripId');
    }

    async getByTripId(tripId) {
        return this.tripReportRepository.findByTripId(tripId);
    }
}

module.exports = TripReportService;

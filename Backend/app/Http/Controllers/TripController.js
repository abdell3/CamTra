const PdfService = require('../../Services/PdfService');

class TripController {
    constructor(tripService) {
        if (!tripService) {
            throw new Error('TripService dependency is required');
        }
        this.tripService = tripService;
        this.pdfService = new PdfService();

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getMyTrips = this.getMyTrips.bind(this);
        this.start = this.start.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.downloadMissionOrder = this.downloadMissionOrder.bind(this);
    }

    async create(req, res, next) {
        try {
            const trip = await this.tripService.createTrip(req.body);
            res.status(200).json({
                success: true,
                message: 'Trip created succesfull ! Here is it : ',
                trip
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trips = await this.tripService.getAll();
            res.status(200).json({
                succes: true,
                message: 'Here is all the Trips : ',
                trips
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getMyTrips(req, res, next) {
        try {
            const driverId = req.user.userId;
            const trips = await this.tripService.getDriverTrips(driverId);
            res.status(200).json({
                success: true,
                message: 'Here are your trips',
                trips
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async start(req, res, next) {
        try {
            const { id } = req.params;
            const driverId = req.user.userId;
            const trip = await this.tripService.startTrip(id, driverId);
            res.status(200).json({
                success: true,
                message: 'Trip started successfully',
                trip
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await this.tripService.update(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Trip updated successfully',
                trip: updated
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.tripService.delete(id);
            res.status(204).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async downloadMissionOrder(req, res, next) {
        try {
            const { id } = req.params;
            const trip = await this.tripService.tripRepository.model
                .findById(id)
                .populate('assignedDriverId')
                .populate('assignedTruckId')
                .populate('assignedTrailerId');

            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const driver = trip.assignedDriverId;
            const truck = trip.assignedTruckId;
            const trailer = trip.assignedTrailerId;

            const pdfBuffer = await this.pdfService.generateMissionOrder(trip, driver, truck, trailer);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="mission_order_${id}.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = TripController;


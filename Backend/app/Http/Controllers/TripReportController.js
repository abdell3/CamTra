class TripReportController {
    constructor(tripReportService) {
        if (!tripReportService) {
            throw new Error('TripReportService dependency is required');
        }
        this.tripReportService = tripReportService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getByTripId = this.getByTripId.bind(this);
    }

    async create(req, res, next) {
        try {
            const driverId = req.user.userId;
            const report = await this.tripReportService.createReport(req.body, driverId);
            res.status(201).json({
                success: true,
                message: 'Trip report created successfully and trip closed',
                report
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
            const reports = await this.tripReportService.getAll();
            res.status(200).json({
                success: true,
                message: 'Here are all the trip reports',
                reports
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getByTripId(req, res, next) {
        try {
            const { tripId } = req.params;
            const report = await this.tripReportService.getByTripId(tripId);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip report not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Here is the trip report',
                report
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = TripReportController;

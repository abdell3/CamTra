class TripController {
    constructor(tripService) {
        if (!tripService) {
            throw new Error('TripService dependency is required');
        }
        this.tripService = tripService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
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
}

module.exports = TripController;


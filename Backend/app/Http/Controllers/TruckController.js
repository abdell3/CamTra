class TruckController {
    constructor(truckService) {
        if (!truckService) {
            throw new Error('TruckService dependency is required');
        }
        this.truckService = truckService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res, next) {
        try {
            const truck = await this.truckService.create(req.body);
            res.status(201).json(truck);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trucks = await this.truckService.getAll();
            res.status(200).json(trucks);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const truck = await this.truckService.getById(id);
            res.status(200).json(truck);
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
            const updatedTruck = await this.truckService.update(id, req.body);
            res.status(200).json(updatedTruck);
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
            await this.truckService.delete(id);
            res.status(200).json({
                success: true,
                message: "Deleted !"
            }).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = TruckController;


class TireController {
    constructor(tireService) {
        if (!tireService) {
            throw new Error('TireService dependency is required');
        }
        this.tireService = tireService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.delete = this.delete.bind(this);
        this.mount = this.mount.bind(this);
        this.dismount = this.dismount.bind(this);
    }

    async create(req, res, next) {
        try {
            const tire = await this.tireService.create(req.body);
            res.status(201).json(tire);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const tires = await this.tireService.getAll();
            res.status(200).json(tires);
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
            const tire = await this.tireService.getById(id);
            res.status(200).json(tire);
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
            await this.tireService.delete(id);
            res.status(204).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async mount(req, res, next) {
        try {
            const { id } = req.params;
            const { vehicleId, vehicleType, position } = req.body;

            if (!vehicleId || !vehicleType || !position) {
                const error = new Error('vehicleId, vehicleType and position are required');
                error.status = 400;
                throw error;
            }

            const tire = await this.tireService.mountTire(id, vehicleId, vehicleType, position);
            res.status(200).json({
                success: true,
                message: 'Tire mounted Succesfully !',
                tire
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                success: false,
                message: error.message || 'Failed !'
            });
            next(error);
        }
    }

    async dismount(req, res, next) {
        try {
            const { id } = req.params;
            const tire = await this.tireService.dismountTire(id);
            res.status(200).json({
                success: true,
                message: 'Tire dismounted succesfulley !'
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                success: false,
                message: error.message || 'Failed !'
            });
            next(error);
        }
    }
}

module.exports = TireController;


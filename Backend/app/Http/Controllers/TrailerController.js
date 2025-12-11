class TrailerController {
    constructor(trailerService) {
        if (!trailerService) {
            throw new Error('TrailerService dependency is required');
        }
        this.trailerService = trailerService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res, next) {
        try {
            const trailer = await this.trailerService.create(req.body);
            res.status(201).json(trailer);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trailers = await this.trailerService.getAll();
            res.status(200).json(trailers);
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
            const trailer = await this.trailerService.getById(id);
            res.status(200).json(trailer);
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
            const updatedTrailer = await this.trailerService.update(id, req.body);
            res.status(200).json(updatedTrailer);
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
            await this.trailerService.delete(id);
            res.status(204).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = TrailerController;


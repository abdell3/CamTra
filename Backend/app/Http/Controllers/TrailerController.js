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
            res.status(201).json({
                succes : true,
                message : 'Trailer created',
                trailer
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                success : false,
                message : error.message || 'Failed to create trailer'
            });
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trailers = await this.trailerService.getAll();
            res.status(200).json({
                success : true, 
                message : "All Trailers are Here : ",
                trailers
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                success : true,
                message : error.message || 'Failed To get all Trailers !'
            });
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const trailer = await this.trailerService.getById(id);
            res.status(200).json({
                succes : true ,
                message : "Trailer is here : ",
                trailer
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                succes : false,
                message : error.message || 'Failed To get Trailer !'
            });
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updatedTrailer = await this.trailerService.update(id, req.body);
            res.status(200).json({
                succes : true,
                message: 'Trailed Updated Succesfully !',
                updatedTrailer,
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                succes : false,
                message : error.message || 'Failed to update Trailer !'
            });
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.trailerService.delete(id);
            res.status(204).json({
                success : true,
                message : 'Trailer Deleted !'
            }).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            res.json({
                success : false,
                message : error.message || 'Failed to delete Trailer'
            });
            next(error);
        }
    }
}

module.exports = TrailerController;


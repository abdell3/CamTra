class MaintenanceRuleController {
    constructor(maintenanceRuleService) {
        if (!maintenanceRuleService) {
            throw new Error('MaintenanceRuleService dependency is required');
        }
        this.maintenanceRuleService = maintenanceRuleService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res, next) {
        try {
            const rule = await this.maintenanceRuleService.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Maintenance Rule created succesfully !',
                rule
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
            const rules = await this.maintenanceRuleService.getAll();
            res.status(200).json({
                succes: true,
                message: 'Here are the Rules : ',
                rules
            });
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
            const rule = await this.maintenanceRuleService.getById(id);
            res.status(200).json({
                success: true,
                message: 'Here is the Rule that you are loking for : ',
                rule
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
            const updatedRule = await this.maintenanceRuleService.update(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Rule Updated succesfully : ',
                updatedRule
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
            await this.maintenanceRuleService.delete(id);
            res.status(200).json({
                success: true,
                message: 'Rule deleted !'
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = MaintenanceRuleController;




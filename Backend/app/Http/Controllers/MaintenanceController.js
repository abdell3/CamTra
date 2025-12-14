class MaintenanceController {
    constructor(maintenanceService) {
        if (!maintenanceService) {
            throw new Error('MaintenanceService dependency is required');
        }
        this.maintenanceService = maintenanceService;

        this.getAlerts = this.getAlerts.bind(this);
    }

    async getAlerts(req, res, next) {
        try {
            const alerts = await this.maintenanceService.checkMaintenanceAlerts();
            res.status(200).json({
                success: true,
                message: 'Maintenance alerts retrieved successfully',
                alerts
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = MaintenanceController;

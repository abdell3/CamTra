class StatsController {
    constructor(statsService) {
        if (!statsService) {
            throw new Error('StatsService dependency is required');
        }
        this.statsService = statsService;

        this.getDashboardStats = this.getDashboardStats.bind(this);
    }

    async getDashboardStats(req, res, next) {
        try {
            const stats = await this.statsService.getDashboardStats();
            res.status(200).json({
                success: true,
                message: 'Dashboard statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = StatsController;

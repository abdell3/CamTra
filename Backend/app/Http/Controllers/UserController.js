class UserController {
    constructor(userService) {
        if (!userService) {
            throw new Error('UserService dependency is required');
        }
        this.userService = userService;

        this.getDrivers = this.getDrivers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.createDriver = this.createDriver.bind(this);
    }

    async getDrivers(req, res, next) {
        try {
            const drivers = await this.userService.getAllDrivers();
            res.status(200).json(drivers);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async createDriver(req, res, next) {
        try {
            const driver = await this.userService.createDriver(req.body);
            const driverObj = driver.toObject ? driver.toObject() : driver;
            const { password, ...safeDriver } = driverObj;
            res.status(201).json(safeDriver);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = UserController;


class MaintenanceRuleService {
    constructor(maintenanceRuleRepository) {
        if (!maintenanceRuleRepository) {
            throw new Error('MaintenanceRuleRepository dependency is required');
        }
        this.maintenanceRuleRepository = maintenanceRuleRepository;
    }

    async create(data) {
        return this.maintenanceRuleRepository.create(data);
    }

    async getAll() {
        return this.maintenanceRuleRepository.model.find({});
    }

    async getById(id) {
        const rule = await this.maintenanceRuleRepository.findById(id);
        if (!rule) {
            const error = new Error('Maintenance rule not found');
            error.status = 404;
            throw error;
        }
        return rule;
    }

    async update(id, data) {
        const existing = await this.maintenanceRuleRepository.findById(id);
        if (!existing) {
            const error = new Error('Maintenance rule not found');
            error.status = 404;
            throw error;
        }
        return this.maintenanceRuleRepository.update(id, data);
    }

    async delete(id) {
        const existing = await this.maintenanceRuleRepository.findById(id);
        if (!existing) {
            const error = new Error('Maintenance rule not found');
            error.status = 404;
            throw error;
        }
        return this.maintenanceRuleRepository.delete(id);
    }
}

module.exports = MaintenanceRuleService;




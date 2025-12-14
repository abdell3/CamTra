class MaintenanceService {
    constructor(truckRepository, maintenanceRuleRepository) {
        if (!truckRepository || !maintenanceRuleRepository) {
            throw new Error('MaintenanceService requires TruckRepository, MaintenanceRuleRepository');
        }
        this.truckRepository = truckRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
    }

    async checkMaintenanceAlerts() {
        const trucks = await this.truckRepository.model.find({});
        const rules = await this.maintenanceRuleRepository.model.find({
            targetEntityType: 'Truck',
            periodKm: { $ne: null }
        });

        const alerts = [];

        for (const truck of trucks) {
            for (const rule of rules) {
                if (!rule.periodKm) continue;

                const remainder = truck.currentKm % rule.periodKm;
                const remainingKm = rule.periodKm - remainder;

                let severity = null;
                if (remainingKm <= 0 || remainder === 0) {
                    severity = 'Critical';
                } else if (remainingKm < 1000) {
                    severity = 'Warning';
                }

                if (severity) {
                    const dueKm = truck.currentKm + remainingKm;

                    alerts.push({
                        truckImmat: truck.immatriculation,
                        ruleName: rule.name,
                        currentKm: truck.currentKm,
                        dueKm: dueKm,
                        remainingKm: remainingKm <= 0 ? 0 : remainingKm,
                        severity: severity
                    });
                }
            }
        }

        return alerts;
    }
}

module.exports = MaintenanceService;

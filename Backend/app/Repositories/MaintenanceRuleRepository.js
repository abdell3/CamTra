const BaseRepository = require('./BaseRepository');

class MaintenanceRuleRepository extends BaseRepository {
    constructor(MaintenanceRuleModel) {
        super(MaintenanceRuleModel);
    }
}

module.exports = MaintenanceRuleRepository;




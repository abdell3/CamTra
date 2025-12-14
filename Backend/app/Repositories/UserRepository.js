const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor(UserModel) {
        super(UserModel);
    }

    async findByEmail(email) {
        return this.model.findOne({ email });
    }

    async findByRole(role) {
        return this.model.find({ role }).select('-password');
    }
}

module.exports = UserRepository;


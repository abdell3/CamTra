const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor(UserModel) {
        super(UserModel);
    }

    async findByEmail(email) {
        return this.model.findOne({ email });
    }
}

module.exports = UserRepository;


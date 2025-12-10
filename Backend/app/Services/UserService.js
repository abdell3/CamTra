class UserService {
    constructor(userRepository) {
        if (!userRepository) {
            throw new Error('UserRepository dependency is required');
        }
        this.userRepository = userRepository;
    }

    async getAllDrivers() {
        return this.userRepository.findByRole('Chauffeur');
    }

    async deleteUser(userId) {
        const existing = await this.userRepository.findById(userId);
        if (!existing) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        return this.userRepository.delete(userId);
    }

    async createDriver(data) {
        const payload = { ...data, role: 'Chauffeur' };
        return this.userRepository.create(payload);
    }

    async updateUser(userId, data) {
        const existing = await this.userRepository.findById(userId);
        if (!existing) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const updateData = { ...data };
        if (updateData.password) {
            delete updateData.password;
        }

        return this.userRepository.update(userId, updateData);
    }
}

module.exports = UserService;


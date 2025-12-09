class AuthService {
    constructor(userRepository, UserModel) {
        if (!userRepository || !UserModel) {
            throw new Error('AuthService requires UserRepository and User model dependencies');
        }
        this.userRepository = userRepository;
        this.UserModel = UserModel;
    }

    async register(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        const user = await this.userRepository.create(userData);
        const token = await user.generateAuthToken();

        return { 
            user, 
            token 
        };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        const token = await user.generateAuthToken();
        return { 
            user, 
            token 
        };
    }
}

module.exports = AuthService;


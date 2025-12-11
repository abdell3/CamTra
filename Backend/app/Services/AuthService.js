const jwt = require('jsonwebtoken');

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
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return { 
            user, 
            accessToken, 
            refreshToken 
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

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        return { 
            user, 
            accessToken, 
            refreshToken 
        };
    }

    async refreshToken(token) {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            const error = new Error('JWT refresh secret is not configured');
            error.status = 500;
            throw error;
        }

        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, secret, (err, payload) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(payload);
                });
            });

            const userId = decoded.id || decoded._id;
            const user = await this.userRepository.findById(userId);
            if (!user) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }

            const accessToken = await user.generateAccessToken();
            const refreshToken = await user.generateRefreshToken();

            return { accessToken, refreshToken };
        } catch (err) {
            const error = new Error('Invalid or expired refresh token');
            error.status = 403;
            throw error;
        }
    }
}

module.exports = AuthService;


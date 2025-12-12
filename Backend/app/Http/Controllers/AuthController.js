class AuthController {
    constructor(authService) {
        if (!authService) {
            throw new Error('AuthService dependency is required');
        }
        this.authService = authService;

        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRefreshToken = this.handleRefreshToken.bind(this);
    }

    async handleRegister(req, res, next) {
        try {
            const payload = { ...req.body };
            if (!payload.role) {
                payload.role = 'Chauffeur';
            }

            const { user, accessToken, refreshToken } = await this.authService.register(payload);
            const userObj = user.toObject ? user.toObject() : user;
            const { password, ...safeUser } = userObj;

            res.status(201).json({ 
                accessToken, 
                refreshToken, 
                user: safeUser 
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await this.authService.login(email, password);

            const userObj = user.toObject ? user.toObject() : user;
            const { password: pw, ...safeUser } = userObj;

            res.status(200).json({ 
                accessToken, 
                refreshToken, 
                user: safeUser 
            });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }

    async handleRefreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshToken(refreshToken);
            res.status(200).json(tokens);
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = AuthController;


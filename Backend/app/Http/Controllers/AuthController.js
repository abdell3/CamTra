class AuthController {
    constructor(authService) {
        if (!authService) {
            throw new Error('AuthService dependency is required');
        }
        this.authService = authService;

        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleRegister(req, res, next) {
        try {
            const payload = { ...req.body };
            if (!payload.role) {
                payload.role = 'Chauffeur';
            }

            const { user, token } = await this.authService.register(payload);
            const userObj = user.toObject ? user.toObject() : user;
            const { password, ...safeUser } = userObj;

            res.status(201).json({ token, user: safeUser });
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
            const { user, token } = await this.authService.login(email, password);

            const userObj = user.toObject ? user.toObject() : user;
            const { password: pw, ...safeUser } = userObj;

            res.status(200).json({ token, user: safeUser });
        } catch (error) {
            if (error.status) {
                res.status(error.status);
            }
            next(error);
        }
    }
}

module.exports = AuthController;


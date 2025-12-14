const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        const error = new Error('Authorization token is missing');
        error.status = 401;
        return next(error);
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            const error = new Error('JWT access secret is not configured');
            error.status = 500;
            return next(error);
        }

        const decoded = jwt.verify(token, secret);
        req.user = { userId: decoded.id || decoded._id, role: decoded.role, ...decoded };
        return next();
    } catch (err) {
        const error = new Error('Invalid or expired token');
        error.status = 401;
        return next(error);
    }
};

const checkRole = (roles = []) => (req, res, next) => {
    if (!req.user) {
        const error = new Error('Unauthorized');
        error.status = 401;
        return next(error);
    }

    const allowed = Array.isArray(roles) && roles.includes(req.user.role);
    if (!allowed) {
        const error = new Error('Forbidden');
        error.status = 403;
        return next(error);
    }

    return next();
};

module.exports = {
    checkAuth,
    checkRole,
};


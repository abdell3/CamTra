/**
 * Middleware qui intercepte les requêtes vers des routes non trouvées (404).
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); 
};

/**
 * Middleware de gestion des erreurs générique.
 * Il doit toujours prendre quatre arguments (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = `Ressource non trouvée avec l'identifiant ${err.value}`;
    }
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue).join(', '); 
        message = `Duplication de la clé : ${field}. Cette valeur doit être unique.`;
    }
    if (err.name === 'ValidationError') {
        statusCode = 400; 
        message = Object.values(err.errors).map(val => val.message).join(' | ');
    }

    res.status(statusCode).json({
        success: false, 
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
module.exports = {
    checkSpoof: (req, res, next) => {
        const referer = req.headers.referer;
        if ((process.env.ENVIRONMENT_NAME === 'production' && referer.includes('straws')) 
            || process.env.ENVIRONMENT_NAME === 'development') {
            next();
        }
        return res.status(500).send({ error: '500 - Request could not be served' });
    }
}
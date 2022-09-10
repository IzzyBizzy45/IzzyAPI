module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Not Allowed');
    if (token != process.env.IZZY_API_MASTERKEY) return res.status(401).send('Not Allowed');
    next();
};
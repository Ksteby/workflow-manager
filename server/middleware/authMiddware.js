module.exports = (req, res, next) => {
    const userId = req.headers['userid'];

    if (!userId) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    req.userId = Number(userId);
    next();
};
const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    await next();
    console.log("called clear cache middleware."); 
    clearHash(req.user.id);
}    
//----------------------------------------------------
// CollaboService.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const CollaboDao = require('../dao/CollaboDao');

exports.list = function () {
    logger.trace("[CollaboService.js][list]start.");
    
    return CollaboDao.load();
}

//----------------------------------------------------
// AwakenskillService.js 
//----------------------------------------------------

const AwakenskillDao = require('../dao/AwakenskillDao');

const logger = require('../util/Logger');

exports.list = function () {
    logger.trace("[AwakenskillService.js][list]start.");

    var objAwakenskill = AwakenskillDao.load();
    
    return objAwakenskill;
}

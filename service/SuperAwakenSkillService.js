//----------------------------------------------------
// SuperAwakenSkillService.js
//----------------------------------------------------

const SuperAwakenSkillDao = require('../dao/SuperAwakenSkillDao');

const logger = require('../util/Logger');

exports.list = function () {
    logger.trace("[SuperAwakenSkillService.js][list]start.");

    var objData = SuperAwakenSkillDao.load();
    
    return objData;
}

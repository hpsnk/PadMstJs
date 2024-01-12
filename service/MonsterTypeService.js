//----------------------------------------------------
// MonsterTypeService.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const MonsterTypeDao = require('../dao/MonsterTypeDao');

exports.list = function () {
    logger.trace("[MonsterTypeService.js][list]start.");

    let objMonsterType = MonsterTypeDao.load();

    return objMonsterType;
}

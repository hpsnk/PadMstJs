//----------------------------------------------------
// MonsterAttrService.js 
//----------------------------------------------------
const logger = require('../util/Logger');
const MonsterAttrDao = require('../dao/MonsterAttrDao');

exports.list = function () {
    logger.trace("[MonsterAttrService.js][list]start.");

    let objMonsterAttr = MonsterAttrDao.load();

    return objMonsterAttr;
}

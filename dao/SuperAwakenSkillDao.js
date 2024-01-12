//----------------------------------------------------
// SuperAwakenSkillDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

let cacheList = [];

exports.load = function () {
    logger.trace("[SuperAwakenSkillDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strData = fs.readFileSync(CONFIG.DATA_FILES.SUPER_AWAKEN_SKILL);

    // string -> json に変更
    let objData = JSON.parse(strData);

    objData.array.forEach(element => {
        cacheList.push(element);
    });

    logger.debug("  size=" + objData.length);

    return objData;
}

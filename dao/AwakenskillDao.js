//----------------------------------------------------
// AwakenskillDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const Config = require('../config');

let cacheList = [];

exports.load = function () {
    logger.trace("[AwakenskillDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strAwakenskill = fs.readFileSync(Config.DATA_FILES.AWAKEN_SKILL);
    // string -> json に変更
    let objAwakenskill = JSON.parse(strAwakenskill);

    objAwakenskill.forEach(element => {
        cacheList.push(element);
    });

    logger.debug("  awakenskill size=" + objAwakenskill.length);

    return objAwakenskill;
}

//----------------------------------------------------
// SkillTagDao.js
// cache
//----------------------------------------------------

var cacheList = [];

const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

exports.load = function () {
    logger.trace("[SkillTagDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strSkillTag = fs.readFileSync(CONFIG.DATA_FILES.SKILL_TAG);

    // string -> json に変更
    let objSkillTag = JSON.parse(strSkillTag);


    objSkillTag.forEach(element => {
        // listに追加
        cacheList.push(element);
    });

    return cacheList;
}

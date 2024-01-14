//----------------------------------------------------
// LeaderSkillCategoryDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

var cacheList = [];
var cacheMap = new Map();

exports.load = function () {
    logger.trace("[LeaderSkillCategoryDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strLeaderSkillCategory = fs.readFileSync(CONFIG.DATA_FILES.LEADER_SKILL_CATEGORY);

    // string -> json に変更
    let objLeaderSkillCategory = JSON.parse(strLeaderSkillCategory);

    objLeaderSkillCategory.forEach(element => {
        // listに追加
        cacheList.push(element);

        // mapに追加
        cacheMap.set(element.leaderskillType, element);
    });

    // for (let i = 0; i < objLeaderSkillCategory.length; i++) {
    //     // listに追加
    //     cacheList.push(objLeaderSkillCategory[i]);

    //     // mapに追加
    //     cacheMap.set(objLeaderSkillCategory[i]['leaderskillType'], objLeaderSkillCategory[i]);
    // }

    return objLeaderSkillCategory;
}

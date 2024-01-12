//----------------------------------------------------
// LeaderSkillCategoryDao.js
// cache
//----------------------------------------------------

var cacheList = [];
var cacheMap = new Map();

const fs = require('fs');
const logger = require('../util/Logger');

const TARGET_FILE = './json/leaderskillcategory.json';

exports.load = function () {
    logger.trace("[LeaderSkillCategoryDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strLeaderSkillCategory = fs.readFileSync(TARGET_FILE);

    // string -> json に変更
    let objLeaderSkillCategory = JSON.parse(strLeaderSkillCategory);

    for (let i = 0; i < objLeaderSkillCategory.length; i++) {
        // listに追加
        cacheList.push(objLeaderSkillCategory[i]);

        // mapに追加
        cacheMap.set(objLeaderSkillCategory[i]['leaderskillType'], objLeaderSkillCategory[i]);
    }

    return objLeaderSkillCategory;
}

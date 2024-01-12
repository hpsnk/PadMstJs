//----------------------------------------------------
// SkillCategoryDao.js
// cache
//----------------------------------------------------

var cacheList = [];
var cacheMap = new Map();

const fs = require('fs');
const logger = require('../util/Logger');

const TARGET_FILE = './json/skillcategory.json';

exports.load = function () {
    logger.trace("[SkillCategoryDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strSkillCategory = fs.readFileSync(TARGET_FILE);

    // string -> json に変更
    let objSkillCategory = JSON.parse(strSkillCategory);

    for (let i = 0; i < objSkillCategory.length; i++) {
        // listに追加
        cacheList.push(objSkillCategory[i]);

        // mapに追加
        cacheMap.set(objSkillCategory[i]['skillType'], objSkillCategory[i]);
    }

    return objSkillCategory;
}

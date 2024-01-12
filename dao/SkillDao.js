//----------------------------------------------------
// SkillDao.js
// cache(list, map)
//----------------------------------------------------

let cacheList = [];
let cacheMap = new Map();

const fs = require('fs');

const logger = require('../util/Logger');

const TARGET_FILE = './json/skill.json';

exports.getById = function (nSkillId) {
    logger.trace("[SkillDao.js][getById]start.");

    if (cacheList.length == 0 || cacheMap.size == 0) {
        this.load();
    }

    let objSkill = cacheMap.get(nSkillId);

    return objSkill;
}

exports.load = function () {
    logger.trace("[SkillDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strSkill = fs.readFileSync(TARGET_FILE);

    // string -> json に変更
    let objSkill = JSON.parse(strSkill);

    for (let i = 0; i < objSkill.length; i++) {
        // listに追加
        cacheList.push(objSkill[i]);

        // mapに追加
        cacheMap.set(objSkill[i]['skillId'], objSkill[i]);
    }

    return objSkill;
}

//----------------------------------------------------
// LeaderSkillDao.js
// cache(list, map)
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

let cacheList = [];
let cacheMap = new Map();

exports.getById = function (nLeaderSkillId) {
    logger.trace("[LeaderSkillDao.js][getById]start.");

    if (cacheList.length == 0 || cacheMap.size == 0) {
        this.load();
    }

    return cacheMap.get(nLeaderSkillId);
}

exports.load = function () {
    logger.trace("[LeaderSkillDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strLeaderSKill = fs.readFileSync(CONFIG.DATA_FILES.LEADER_SKILL);
    // string -> json に変更
    let objLeaderSKill = JSON.parse(strLeaderSKill);

    objLeaderSKill.forEach(element => {
        // listに追加
        cacheList.push(element);

        // mapに追加
        cacheMap.set(element.leaderskillId, element);
    });
    // for (let i = 0; i < objLeaderSKill.length; i++) {
    //     // listに追加
    //     cacheList.push(objLeaderSKill[i]);

    //     // mapに追加
    //     cacheMap.set(objLeaderSKill[i]['leaderskillId'], objLeaderSKill[i]);
    // }

    logger.debug("  size=" + cacheList.length);

    return objLeaderSKill;
}

//----------------------------------------------------
// MonsterDao.js
// cache
//----------------------------------------------------

const fs       = require('fs');
const logger   = require('../util/Logger');
const CONFIG   = require('../config');

const SkillDao       = require('../dao/SkillDao');
const LeaderSkillDao = require('../dao/LeaderSkillDao');

let cacheList = [];
let cacheMap = new Map();

exports.getByMonsterId = function (nMonsterId) {
    logger.trace("[MonsterDao.js][getByMonsterId]start.");

    let objMonster = cacheMap.get(nMonsterId);

    return objMonster;
}

exports.load = function () {
    logger.trace("[MonsterDao.js][load]start.");

    // cacheした場合
    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strMonster = fs.readFileSync(CONFIG.DATA_FILES.MONSTER);
    // string -> json に変更
    let objMonster = JSON.parse(strMonster);

    objMonster.forEach(element => {
        // 补充monster的skill信息
        // スキルID
        let nSkillId = element.skillId;
        // スキル取得
        let objSkill = SkillDao.getById(nSkillId);

        if (objSkill != undefined) {
            if (objSkill.initTurn > 0) {
                // スキルターン算出
                objSkill.turn = objSkill.initTurn - objSkill.maxLv + 1;
            } else {
                objSkill.turn = 0;
            }
            element.skill = objSkill;
        } else {
            element.skill = undefined;
        }

        // 补充monster的leaderskill信息
        let objLeaderSkill = LeaderSkillDao.getById(element.leaderskillId);
        if (objLeaderSkill != undefined) {
            element.leaderskill = objLeaderSkill;
        } else {
            element.leaderskill = undefined;
        }

        // listに追加
        cacheList.push(element);

        // mapに追加
        cacheMap.set(element.monsterId, element);
    });
        
    logger.debug('  cacheList.length=' + cacheList.length);
    logger.debug('  cacheMap.size=' + cacheMap.size);

    return cacheList;
}

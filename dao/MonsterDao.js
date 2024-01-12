//----------------------------------------------------
// MonsterDao.js
// cache
//----------------------------------------------------

const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

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
        // listに追加
        cacheList.push(element);

        // mapに追加
        cacheMap.set(element.monsterId, element);
    });

    // for (monsterIdx = 0; monsterIdx < objMonster.length; monsterIdx++) {

    //     // unknownでない場合
    //     // if (objMonster[monsterIdx]['unknown'] == false) {
    //         // listに追加
    //         cacheList.push(objMonster[monsterIdx]);

    //         // mapに追加
    //         cacheMap.set(objMonster[monsterIdx]['monsterId'], objMonster[monsterIdx]);
    //     // }
    // }
        
    logger.debug('  cacheList.length=' + cacheList.length);
    logger.debug('  cacheMap.size=' + cacheMap.size);

    return cacheList;
}

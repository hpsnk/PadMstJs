//----------------------------------------------------
// MonsterTypeDao.js
// cache
//----------------------------------------------------

var cacheList = [];
var cacheMap = new Map();

const fs = require('fs');
const logger = require('../util/Logger');

const TARGET_FILE = './json/monster_type.json';

exports.load = function () {
    logger.trace("[MonsterTypeDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strType = fs.readFileSync(TARGET_FILE);

    // string -> json に変更
    let objType = JSON.parse(strType);

    for (let i = 0; i < objType.length; i++) {
        // listに追加
        cacheList.push(objType[i]);

        // mapに追加
        cacheMap.set(objType[i]['typeId'], objType[i]);
    }

    return objType;
}

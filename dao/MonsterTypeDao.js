//----------------------------------------------------
// MonsterTypeDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const Config = require('../config');

var cacheList = [];
var cacheMap = new Map();

exports.load = function () {
    logger.trace("[MonsterTypeDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strType = fs.readFileSync(Config.DATA_FILES.MONSTER_TYPE);

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

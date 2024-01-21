//----------------------------------------------------
// MonsterAttrDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const CONFIG = require('../config');

var cacheList = [];
var cacheMap = new Map();

exports.load = function () {
    logger.trace("[MonsterAttrDao.js][load]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    let strAttr = fs.readFileSync(CONFIG.DATA_FILES.MONSTER_ATTR);
    // string -> json に変更
    let objAttr = JSON.parse(strAttr);

    objAttr.forEach(element => {
        // listに追加
        cacheList.push(element);

        // mapに追加
        cacheMap.set(element.id, element);        
    });

    return objAttr;
}

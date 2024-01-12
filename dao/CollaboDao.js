//----------------------------------------------------
// CollaboDao.js
// cache
//----------------------------------------------------
const fs = require('fs');
const logger = require('../util/Logger');
const Config = require('../config');

let cacheList = [];

exports.load = function () {
    logger.trace("[CollaboDao.js][list]start.");

    if (cacheList.length > 0) {
        return cacheList;
    }

    //read file
    var strCollabo = fs.readFileSync(Config.DATA_FILES.COLLABO);
    // string -> json に変更
    var objCollabo = JSON.parse(strCollabo);

    objCollabo.forEach(element => {
        cacheList.push(element);        
    });

    logger.debug("  collabo size=" + objCollabo.length);

    return objCollabo;
}

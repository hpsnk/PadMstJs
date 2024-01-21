//----------------------------------------------------
// MonsterAttrAction.js 
//----------------------------------------------------
const logger = require('../util/Logger');
const ActionUtils = require('../util/ActionUtils');

const MonsterAttrService = require('../service/MonsterAttrService')

exports.list = function (req, res) {
    logger.trace("[MonsterAttrAction.js][list]start.");

    // 解析 url 参数
    let params = ActionUtils.analyzeParam(req);

    let objMonsterAttr = MonsterAttrService.list();

    ActionUtils.doResponse(params, res, JSON.stringify(objMonsterAttr));
}

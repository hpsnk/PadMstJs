//----------------------------------------------------
// CollaboAction.js
//----------------------------------------------------
const ActionUtils = require('../util/ActionUtils');
const logger = require('../util/Logger');

const CollaboService = require('../service/CollaboService');

exports.list = function (req, res) {
    logger.trace("[CollaboAction.js][list]start.");

    // 解析 url 参数
    let params = ActionUtils.analyzeParam(req);

    let objCollabo = CollaboService.list();

    ActionUtils.doResponse(params, res, JSON.stringify(objCollabo));
}

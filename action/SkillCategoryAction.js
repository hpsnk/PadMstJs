//----------------------------------------------------
// SkillCategoryAction.js
//----------------------------------------------------

const ActionUtils = require('../util/ActionUtils');
const logger = require('../util/Logger');

const SkillCategoryService = require('../service/SkillCategoryService');

exports.list = function (req, res) {
    logger.trace("[SkillCategoryAction.js][list]start.");

    // 解析 url 参数
    let params = ActionUtils.analyzeParam(req);

    let objSkillCategory = SkillCategoryService.list();

    ActionUtils.doResponse(params, res, JSON.stringify(objSkillCategory));

}

exports.list4Datatables = function (req, res) {
    logger.trace("[SkillCategoryAction.js][list4Datatables]start.");
    // todo:実装待ち
}

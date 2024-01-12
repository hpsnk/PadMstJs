//----------------------------------------------------
// LeaderSkillCategoryAction.js
//----------------------------------------------------

const ActionUtils = require('../util/ActionUtils');
const logger = require('../util/Logger');

const LeaderSkillCategoryService = require('../service/LeaderSkillCategoryService');

exports.list = function (req, res) {
    logger.trace("[LeaderSkillCategoryAction.js][list]start.");

    // 解析 url 参数
    let params = ActionUtils.analyzeParam(req);

    let objLeaderSkillCategory = LeaderSkillCategoryService.list();
    
    logger.debug("  objLeaderSkillCategory.length = " + objLeaderSkillCategory.length);

    ActionUtils.doResponse(params, res, JSON.stringify(objLeaderSkillCategory));
}

// exports.list4Datatables = function (req, res) {
//     logger.trace("[SkillCategoryAction.js][list4Datatables]start.");
//     // todo:実装待ち
// }

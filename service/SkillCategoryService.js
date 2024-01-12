//----------------------------------------------------
// SkillCategoryService.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const SkillCategoryDao = require('../dao/SkillCategoryDao');

exports.list = function () {
    logger.trace("[SkillCategoryService.js][list]start.");

    let objSkillCategory = SkillCategoryDao.load();
    
    return objSkillCategory;
}

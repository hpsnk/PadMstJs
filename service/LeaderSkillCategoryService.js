//----------------------------------------------------
// LeaderSkillCategoryService.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const LeaderSkillCategoryDao = require('../dao/LeaderSkillCategoryDao');

exports.list = function () {
    logger.trace("[LeaderSkillCategoryService.js][list]start.");

    let objLeaderSkillCategory = LeaderSkillCategoryDao.load();
    
    return objLeaderSkillCategory;
}

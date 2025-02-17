//----------------------------------------------------
// SkillService.js 
//----------------------------------------------------

const ArrayUtils = require('../util/ArrayUtils');

const SkillDao = require('../dao/SkillDao');
const SkillTagDao = require('../dao/SkillTagDao');

const logger = require('../util/Logger');


exports.search = function (params) {
    logger.trace("[SkillService.js][search]start.");

    let skillList = SkillDao.load();

    return skillList;
}

exports.filter = function (params, skillList) {
    logger.trace("[SkillService.js][filter]start.");

    let filteredSkillList = skillList;

    // スキルカテゴリ
    filteredSkillList = filterBySkillCategory(params, filteredSkillList);

    return filteredSkillList;
}

// スキルカテゴリ
function filterBySkillCategory(params, inList) {
    let inSkillCategory = params['skillcategory[]'];
    // 検索条件に スキルカテゴリ が存在しない場合
    if (inSkillCategory == undefined) {
        return inList;
    }

    logger.trace("[SkillService.js][filterBySkillCategory]start.");

    // let searchSkillCategorys = ArrayUtils.toNumberArray(inSkillCategory);

    // let targetSkillIdList = SkillService.getSkillIdListByCategory(searchSkillCategorys);

    let outList = [];

    // for (let i = 0; i < inList.length; i++) {

    //     if (ArrayUtils.containsAny(targetSkillIdList, inList[i]['skillId'])) {
    //         outList.push(inList[i]);
    //     }
    // }

    return outList;
}


//
//
exports.getSkillIdListByCategory = function (nCategoryArray) {
    logger.trace("[SkillService.js][getSkillIdListByCategory]start.");

    // get skill by category
    let objSkillList = getSkillByCategory(nCategoryArray);

    let outList = [];

    for (let i = 0; i < objSkillList.length; i++) {
        outList.push(objSkillList[i]['skillId']);
    }

    return outList;
}

function getSkillByCategory(nCategoryArray) {
    let inList = SkillDao.load();

    let outList = [];

    for (let i = 0; i < inList.length; i++) {

        if (ArrayUtils.containsAll(inList[i]['types'], nCategoryArray)) {
            outList.push(inList[i]);
        } else {
        }
    }

    return outList;
}

exports.listSkillTag = function (params) {
    logger.trace("[SkillService.js][listSkillTag]start.");

    let skillTagList = SkillTagDao.load();

    return skillTagList;
}

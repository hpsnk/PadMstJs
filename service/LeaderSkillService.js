//----------------------------------------------------
// LeaderSkillService.js 
//----------------------------------------------------

const ArrayUtils = require('../util/ArrayUtils');
const StringUtils = require('../util/StringUtils');
const logger = require('../util/Logger');

const LeaderSkillDao = require('../dao/LeaderSkillDao');

exports.list = function (params) {
    logger.trace("[LeaderSkillService.js][search]start.");

    let leaderSkillList = LeaderSkillDao.load();

    return leaderSkillList;
}

exports.filter = function (params, leaderSkillList) {
    logger.trace("[LeaderSkillService.js][filter]start.");

    let filteredLeaderSkillList = leaderSkillList;

    // freeword(name, gameDesc)
    filteredLeaderSkillList = filterByFreeword(params, filteredLeaderSkillList);

    // リーダースキルカテゴリ
    filteredLeaderSkillList = filterByLeaderSkillCategory(params, filteredLeaderSkillList);

    return filteredLeaderSkillList;
}

// freeword(name, gameDesc)
function filterByFreeword(params, inList) {
    // 検索条件にfreewordが存在しない場合
    if (params['freeword'] == undefined || params['freeword'].length == 0) {
        return inList;
    }

    logger.trace("[LeaderSkillService.js][filterByFreeword]start.");

    let outList = [];

    for (let i = 0; i < inList.length; i++) {
        let isTarget = false;
        let testLeaderSkill = inList[i];

        // name
        if (String(testLeaderSkill.name).match(params['freeword']) != null) {
            isTarget = true;
        }

        // gameDesc
        if (String(testLeaderSkill.gameDesc).match(params['freeword']) != null) {
            isTarget = true;
        }

        if (isTarget) {
            outList.push(testLeaderSkill);
        }
    }

    return outList;
}

// リーダースキルカテゴリ
function filterByLeaderSkillCategory(params, inList) {
    let inSkillCategory = params['leaderSkillCategory'];
    // 検索条件に リーダースキルカテゴリ が存在しない場合
    if (inSkillCategory == undefined) {
        return inList;
    }

    logger.trace("[LeaderSkillService.js][filterByLeaderSkillCategory]start.");

    let outList = [];

    for (let i = 0; i < inList.length; i++) {
        let lsTypes = inList[i].types;
        let searchLSTypes = ArrayUtils.toNumberArray(params['leaderSkillCategory']);
        // 検索条件 and/or
        if (StringUtils.equals(params['leaderSkillCategoryCondAnd'], 'true')) {
            // logger.debug("  search by and");
            // リーダースキルカテゴリ, and
            if (ArrayUtils.containsAll(lsTypes, searchLSTypes)) {
                outList.push(inList[i]);
            }
        } else {
            // logger.debug("  search by or");
            // リーダースキルカテゴリ, or
            if (ArrayUtils.containsAny(lsTypes, searchLSTypes)) {
                outList.push(inList[i]);
            }
        }
        // if (i==0) {
        //     logger.debug("lsTypes      =" + lsTypes);
        //     logger.debug("searchLSTypes=" + searchLSTypes);
        //     logger.debug(ArrayUtils.containsAny(lsTypes, searchLSTypes));
        // }
    }

    return outList;
}

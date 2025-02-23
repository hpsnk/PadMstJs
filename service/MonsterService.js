//----------------------------------------------------
// MonsterService.js 
//----------------------------------------------------

const ArrayUtils = require('../util/ArrayUtils');

const SkillService = require('../service/SkillService');

const MonsterDao = require('../dao/MonsterDao');
const SkillDao = require('../dao/SkillDao');
const LeaderSkillDao = require('../dao/LeaderSkillDao');

const logger = require('../util/Logger');

exports.load = function () {
    MonsterDao.load();
}

exports.list = function () {
    logger.trace("[MonsterService.js][list]start.");

    let objMonster = MonsterDao.load();

    return objMonster;
}

exports.filter = function (params, monsterList) {
    logger.trace("[MonsterService.js][filter]start.");

    let filteredMonsterList = monsterList;

    // freeword : id, name    
    filteredMonsterList = filterByFreeword(params, filteredMonsterList);

    // 主属性
    filteredMonsterList = filterByMainAttr(params, filteredMonsterList);

    // サブ属性
    filteredMonsterList = filterBySubAttr(params, filteredMonsterList);

    // 第三属性
    filteredMonsterList = filterByThirdAttr(params, filteredMonsterList);

    // レア
    filteredMonsterList = filterByRare(params, filteredMonsterList);

    // タイプ
    filteredMonsterList = filterByType(params, filteredMonsterList);

    // 覚醒スキル
    filteredMonsterList = filterByAwakenSkill(params, filteredMonsterList);

    // コラボ
    filteredMonsterList = filterByCollabo(params, filteredMonsterList);

    // スキルカテゴリ
    filteredMonsterList = filterBySkillCategory(params, filteredMonsterList);
    //logger.debug("  monster size:" + filteredMonsterList.length);

    // スキルターン
    filteredMonsterList = filterBySkillTurn(params, filteredMonsterList);
    //logger.debug("  monster size:" + filteredMonsterList.length);

    // スキル freeword
    filteredMonsterList = filterBySkillFreeword(params, filteredMonsterList);
    //logger.debug("  monster size:" + filteredMonsterList.length);

    // リーダースキル freeword
    filteredMonsterList = filterByLeaderskillFreeword(params, filteredMonsterList);

    return filteredMonsterList;
}

exports.sort = function (params, monsterList) {
    logger.trace("[MonsterService.js][sort]start.");

    // 検索条件に覚醒スキルが存在しない場合
    if (params['awakenSkill[]'] != undefined && params['awakenSkillSortByCount'] == 'true') {
        logger.warn("  多い順でソートする");

        monsterList.sort(function (a, b) {
            return b.sortByCount - a.sortByCount;
        });
    } else {
        logger.warn("  多い順でソートしない");
    }

    return monsterList;
}

// freeword
function filterByFreeword(params, inList) {
    // 検索条件にfreewordが存在しない場合
    if (params['freeword'] == undefined || params['freeword'].length == 0) {
        return inList;
    }

    let outList = [];

    for (let i = 0; i < inList.length; i++) {
        let testMonster = inList[i];

        let isTarget = false;

        //NO
        if (String(testMonster.monsterId).match(params['freeword']) != null) {
            isTarget = true;
        }

        //名前
        if (testMonster.name.match(params['freeword']) != null) {
            isTarget = true;
        }

        if (isTarget) {
            outList.push(testMonster);
        }
    }

    return outList;
}

// メイン属性
// 主属性
function filterByMainAttr(params, inList) {
    let paramMainAttr = params['mainAttr'];

    // 検索条件に主属性が存在しない場合
    if (paramMainAttr == undefined) {
        return inList;
    }
    
    logger.debug("[MonsterService.js][filterByMainAttr]start.");

    let outList = inList.filter(monster => {
        let monsterMainAttr = [monster.attr];
        let searchMainAttrs = ArrayUtils.toNumberArray(paramMainAttr);
        return ArrayUtils.containsAny(monsterMainAttr, searchMainAttrs);
    });
    logger.debug('  out.size=' + outList.length);

    return outList;
}

// サブ属性
// 副属性
function filterBySubAttr(params, inList) {
    let paramSubAttr = params['subAttr'];

    // 検索条件にサブ属性が存在しない場合
    if (paramSubAttr == undefined) {
        return inList;
    }
    
    logger.debug("[MonsterService.js][filterBySubAttr]start.");

    let outList = inList.filter(monster => {
        let monsterSubAttr = [monster.subAttr];
        let searchSubAttrs = ArrayUtils.toNumberArray(paramSubAttr);
        return ArrayUtils.containsAny(monsterSubAttr, searchSubAttrs);
    });
    logger.debug('  out.size=' + outList.length);

    return outList;
}

// 第三属性
function filterByThirdAttr(params, inList) {
    let paramThirdAttr = params['thirdAttr'];

    // 検索条件に第三属性が存在しない場合
    if (paramThirdAttr == undefined) {
        return inList;
    }
    
    logger.debug("[MonsterService.js][filterByThirdAttr]start.");

    let outList = inList.filter(monster => {
        let monsterThirdAttr = [monster.thirdAttr];
        let searchThirdAttrs = ArrayUtils.toNumberArray(paramThirdAttr);
        return ArrayUtils.containsAny(monsterThirdAttr, searchThirdAttrs);
    });
    logger.debug('  out.size=' + outList.length);

    return outList;
}

// レア
function filterByRare(params, inList) {
    let paramRare = params['rare'];

    // 検索条件に レア が存在しない場合
    if (paramRare == undefined) {
        return inList;
    }
    
    logger.debug("[MonsterService.js][filterByRare]start.");

    let outList = inList.filter(monster => {
        return paramRare == monster.rare;
    });
    logger.debug('  out.size=' + outList.length);

    return outList;
}

// タイプ
function filterByType(params, inList) {
    let inType = params['type'];

    // 検索条件にタイプが存在しない場合
    if (inType == undefined) {
        return inList;
    }

    let outList = [];

    for (let i = 0; i < inList.length; i++) {
        let testMonster = inList[i];
        let monsterType = [];
        // type1
        if (testMonster.typeId != -1) {
            monsterType.push(testMonster.typeId);
        }
        //type2
        if (testMonster.subTypeId != -1) {
            monsterType.push(testMonster.subTypeId);
        }
        //type3
        if (testMonster.extraTypeId != -1) {
            monsterType.push(testMonster.extraTypeId);
        }
        let searchTypeArray = ArrayUtils.toNumberArray(inType);
        // and/or
        if (params['typeCondAnd'] != undefined && params['typeCondAnd'] == 'true') {
            // type, and
            if (ArrayUtils.containsAll(monsterType, searchTypeArray)) {
                outList.push(inList[i]);
            }
        } else {
            // type, or
            if (ArrayUtils.containsAny(monsterType, searchTypeArray)) {
                outList.push(inList[i]);
            }
        }
    }

    return outList;
}

// 覚醒スキル
function filterByAwakenSkill(params, inList) {
    let inAwakenSkill = params['awakenSkill'];

    // 検索条件に覚醒スキルが存在しない場合
    if (inAwakenSkill == undefined) {
        return inList;
    }

    let outList = [];

    for (let i = 0; i < inList.length; i++) {
        let monsterAwakenSkill = inList[i].awakenskillIds;
        let searchAwakenSkillArray = ArrayUtils.toNumberArray(inAwakenSkill);

        if (params['awakenSkillSortByCount'] == 'true' && ArrayUtils.containsAll(monsterAwakenSkill, searchAwakenSkillArray)) {
            // 覚醒スキル 多い順の場合
            // and/or条件は判断なし、and条件で行う
            let sortByCount = ArrayUtils.countByContainsAny(monsterAwakenSkill, searchAwakenSkillArray);
            inList[i].sortByCount = sortByCount;
            if (sortByCount > 0) {
                outList.push(inList[i]);
            }

        } else {
            // and/or条件
            if (params['awakenSkillCondAnd'] != undefined && params['awakenSkillCondAnd'] == 'true') {
                // and条件
                if (ArrayUtils.containsAll(monsterAwakenSkill, searchAwakenSkillArray)) {
                    outList.push(inList[i]);
                }
            } else {
                // or条件
                if (ArrayUtils.containsAny(monsterAwakenSkill, searchAwakenSkillArray)) {
                    outList.push(inList[i]);
                }
            }
        }
    }

    return outList;
}

// コラボ
function filterByCollabo(params, inList) {
    // 検索条件にコラボが存在しない場合
    if (params['collabo'] == undefined || params['collabo'] == '') {
        return inList;
    }

    logger.trace("[MonsterService.js][filterByCollabo]start.");

    let outList = [];

    for (let i = 0; i < inList.length; i++) {

        if (inList[i]['collaboId'] == params['collabo']) {
            outList.push(inList[i]);
        }
    }

    return outList;
}

// スキルカテゴリ
function filterBySkillCategory(params, inList) {
    let inSkillCategory = params['skillcategory[]'];
    // 検索条件にコラボが存在しない場合
    if (inSkillCategory == undefined) {
        return inList;
    }

    logger.trace("[MonsterService.js][filterBySkillCategory]start.");

    let searchSkillCategorys = ArrayUtils.toNumberArray(inSkillCategory);

    let targetSkillIdList = SkillService.getSkillIdListByCategory(searchSkillCategorys);

    let outList = [];

    for (let i = 0; i < inList.length; i++) {

        if (ArrayUtils.containsAny(targetSkillIdList, inList[i]['skillId'])) {
            outList.push(inList[i]);
        }
    }

    return outList;
}

// スキルターン
function filterBySkillTurn(params, inList) {
    logger.trace("[MonsterService.js][filterBySkillTurn]check.");

    let inSkillTurn = params['skillturn'];
    // 検索条件に スキルターン が存在しない場合
    if (inSkillTurn == undefined) {
        return inList;
    }

    logger.debug("[MonsterService.js][filterBySkillTurn]start.");
    // 
    module.exports.fillSkillInfo(inList);

    let outList = inList.filter(monster => {
        if (monster.skill == undefined) {
            return false;
        }

        isMatched = false;

        if (monster.skill.turn == parseInt(inSkillTurn)) {
            isMatched =  true;
        }
        return isMatched;
    });

    return outList;
}

// スキル freeword
function filterBySkillFreeword(params, inList) {
    logger.trace("[MonsterService.js][filterBySkillFreeword]check.");

    let inSkillFreeword = params['skillFreeword'];
    // 検索条件に スキル freeword が存在しない場合
    if (inSkillFreeword == undefined) {
        return inList;
    }

    logger.debug("[MonsterService.js][filterBySkillFreeword]start.");
    
    // 
    module.exports.fillSkillInfo(inList);

    let outList = inList.filter(monster => {
        if (monster.skill == undefined) {
            return false;
        }

        isMatched = false;

        if (monster.skill.name.match(inSkillFreeword) != null ||
            monster.skill.gameDesc.match(inSkillFreeword) != null) {
            isMatched =  true;
        }
        return isMatched;
    });

    return outList;
}

// リーダースキル freeword
function filterByLeaderskillFreeword(params, inList) {
    let inLeaderskillFreeword = params['leaderskillFreeword'];
    // 検索条件に リーダースキル freeword が存在しない場合
    if (inLeaderskillFreeword == undefined) {
        return inList;
    }

    logger.trace("[MonsterService.js][filterByLeaderskillFreeword]start.");

    //
    module.exports.fillLeaderSkillInfo(inList);

    let outList = inList.filter(monster => {
        if (monster.leaderskill == undefined) {
            return false;
        }

        isMatched = false;

        if (monster.leaderskill.gameDesc.match(inLeaderskillFreeword) != null) {
            isMatched =  true;
        }
        return isMatched;
    });

    return outList;
}

exports.getTeamMonsterInfo = function (objTeamIn) {
    logger.trace("[MonsterService.js][getTeamMonsterInfo]start.");

    let objTeamOut = {
        'member1p': [],
        'assist1p': [],
        'member2p': [],
        'assist2p': [],
        'member3p': [],
        'assist3p': []
    };

    //member1p
    for (let i = 0; i < objTeamIn['member1p'].length; i++) {
        if (objTeamIn['member1p'][i] === undefined) {
            objTeamOut['member1p'].push(undefined);
        } else {
            let monsterId = objTeamIn['member1p'][i];
            if (typeof monsterId != 'number') {
                monsterId = parseInt(monsterId);
            }
            let objMonster = MonsterDao.getByMonsterId(monsterId);
            objTeamOut['member1p'].push(objMonster);
        }
    }

    //assist1p
    for (let i = 0; i < objTeamIn['assist1p'].length; i++) {
        if (objTeamIn['assist1p'][i] === undefined) {
            objTeamOut['assist1p'].push(undefined);
        } else {
            let monsterId = objTeamIn['assist1p'][i];
            if (typeof monsterId != 'number') {
                monsterId = parseInt(monsterId);
            }
            let objMonster = MonsterDao.getByMonsterId(monsterId);
            objTeamOut['assist1p'].push(objMonster);
        }
    }

    //member2p
    //assist2p

    return objTeamOut;
}

exports.fillSkillInfo = function (inList) {
    logger.trace("[MonsterService.js][fillSkillInfo]start.");

    inList.forEach(element => {
        // スキルID
        let nSkillId = element.skillId;
        // スキル取得
        let objSkill = SkillDao.getById(nSkillId);

        if (objSkill != undefined && objSkill.initTurn != 0 && objSkill.maxLv != 0) {
            // スキルターン算出
            objSkill.turn = objSkill.initTurn - objSkill.maxLv + 1;
        }

        element.skill = objSkill;
    });
}


exports.fillLeaderSkillInfo = function (inList) {
    logger.trace("[MonsterService.js][fillLeaderSkillInfo]start.");

    for (let i = 0; i < inList.length; i++) {

        let nLeaderskillId = inList[i]['leaderskillId'];

        let objLeaderSkill = LeaderSkillDao.getById(nLeaderskillId);

        inList[i]['leaderskill'] = objLeaderSkill;
    }
}

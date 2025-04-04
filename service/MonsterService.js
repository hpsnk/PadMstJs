//----------------------------------------------------
// MonsterService.js 
//----------------------------------------------------

const ArrayUtils = require('../util/ArrayUtils');

const SkillService = require('../service/SkillService');

const MonsterDao = require('../dao/MonsterDao');
const AwakenskillDao = require('../dao/AwakenskillDao');

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
    logger.debug("  [filterByAwakenSkill]monster size:" + filteredMonsterList.length);

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

// sort
exports.sort = function (params, monsterList) {
    logger.trace("[MonsterService.js][sort]start.");

    let arraySortList = monsterList.slice();

    // 検索条件に覚醒スキルが存在しない場合
    if (params['awakenSkill[]'] != undefined && params['awakenSkillSortByCount'] == 'true') {
        logger.warn("  多い順でソートする");

        arraySortList.sort(function (a, b) {
            return b.sortByCount - a.sortByCount;
        });
    } else if (params['sortBy'] != undefined) {
        // logger.warn("  多い順でソートしない");

        // 按 monsterId 排序
        if (params['sortBy'] == 1) {
            arraySortList.sort(function (a, b) {
                let val = a.monsterId - b.monsterId;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }

        // 按 MP 排序
        if (params['sortBy'] == 2) {
            arraySortList.sort(function (a, b) {
                let val = a.mp - b.mp;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }

        // 按 HP 排序
        if (params['sortBy'] == 3) {
            arraySortList.sort(function (a, b) {
                let val = a.maxHP - b.maxHP;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }

        // 按 ATK 排序
        if (params['sortBy'] == 4) {
            arraySortList.sort(function (a, b) {
                let val = a.maxATK - b.maxATK;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }

        // 按 RCV 排序
        if (params['sortBy'] == 5) {
            arraySortList.sort(function (a, b) {
                let val = a.maxRCV - b.maxRCV;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }

        // 按 SkillTurn 排序
        if (params['sortBy'] == 6) {
            arraySortList.sort((a, b) => {
                // 判断有效技能：skill存在且turn有定义且不等于0
                const hasValidSkill = (monster) => 
                    monster.skill !== undefined && 
                    monster.skill?.turn !== undefined && 
                    monster.skill.turn !== 0;
            
                const aValid = hasValidSkill(a);
                const bValid = hasValidSkill(b);
            
                // 场景1: 两者都有有效技能 -> 比较turn值并应用升降序
                if (aValid && bValid) {
                    const aTurn = a.skill.turn;
                    const bTurn = b.skill.turn;
                    let comparison = aTurn - bTurn;
                    // 仅在有效技能比较时应用升降序反转‌:ml-citation{ref="7" data="citationList"}
                    return params['sortKbn'] == 2 ? -comparison : comparison;
                }
            
                // 场景2: 仅a有有效技能 -> a排前面（不受升降序影响）
                if (aValid) return -1;
                // 场景3: 仅b有有效技能 -> b排前面（不受升降序影响）
                if (bValid) return 1;
            
                // 场景4: 都无有效技能 -> 保持原始顺序
                return 0;
            });
        }
        
        if (params['sortBy'] == 7) {
            // 按 稀有度 排序
            arraySortList.sort(function (a, b) {
                let val = a.rare - b.rare;
                if (params['sortKbn'] == 2) {
                    // 降序
                    val *= -1;
                }
                return val
            });
        }
    }

    return arraySortList;
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
function filterByAwakenSkill(params, inMonsterList) {
    let inAwakenSkill = params['awakenSkill'];

    // 検索条件に覚醒スキルが存在しない場合
    if (inAwakenSkill == undefined) {
        return inMonsterList;
    }
    logger.debug("[MonsterService.js][filterByAwakenSkill]start.");

    let outList = [];
    
    // 觉醒技能Master
    let awakenSkillMstList = AwakenskillDao.load();

    // 输入的觉醒ID
    let inputAwakenSkillArray = ArrayUtils.toNumberArray(inAwakenSkill);
    // logger.debug(`  inputAwakenSkillArray =${inputAwakenSkillArray}`);

    // 等效觉醒变换后的检索觉醒ID
    let searchAwakenSkillArray = [];
    inputAwakenSkillArray.forEach(inputId => {

        let hasEquivalentId = false;

        awakenSkillMstList.forEach(awakenSkill => {
            // 大觉醒的等效觉醒(小觉醒) = input觉醒Id
            if (awakenSkill.equivalentId != undefined && inputId == awakenSkill.equivalentId ) {

                hasEquivalentId = true;

                // 小觉醒，大觉醒 加入检索对象
                searchAwakenSkillArray.push([inputId, awakenSkill.awakenskillId]);
            }
        });

        if (!hasEquivalentId) {
            // 原始的input觉醒Id
            searchAwakenSkillArray.push(inputId);
        }
    });

    for (let i = 0; i < inMonsterList.length; i++) {
        let monsterAwakenSkill = [];
        // 觉醒、超觉醒
        monsterAwakenSkill.push(inMonsterList[i].awakenskillIds);
        monsterAwakenSkill.push(inMonsterList[i].superawakenskillIds);
        // 使用 flat(Infinity) 把 targetObj 降维成一维数组
        monsterAwakenSkill = monsterAwakenSkill.flat(Infinity);

        let isTarget = false;

        if (params['awakenSkillSortByCount'] == 'true' && ArrayUtils.containsAll(monsterAwakenSkill, searchAwakenSkillArray)) {
            // 覚醒スキル 多い順の場合
            // and/or条件は判断なし、and条件で行う
            
            let sortByCount = ArrayUtils.countByContainsAny(monsterAwakenSkill, searchAwakenSkillArray);
            
            inMonsterList[i].sortByCount = sortByCount;
            if (sortByCount > 0) {
                isTarget = true;
                // todo 等效觉醒 sort用评价数计算
            }

        } else {
            // and/or条件

            if (params['awakenSkillCondAnd'] != undefined && params['awakenSkillCondAnd'] == 'true') {
                // and条件
                if (ArrayUtils.containsAll(monsterAwakenSkill, searchAwakenSkillArray)) {
                    isTarget = true;
                }
            } else {
                // or条件
                if (ArrayUtils.containsAny(monsterAwakenSkill, searchAwakenSkillArray)) {
                    isTarget = true;
                }
            }
        }

        if (isTarget) {
            outList.push(inMonsterList[i]);
        }
    }

    logger.debug("[MonsterService.js][filterByAwakenSkill]end.");

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
    // module.exports.fillSkillInfo(inList);

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
    // module.exports.fillSkillInfo(inList);

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
    // module.exports.fillLeaderSkillInfo(inList);

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

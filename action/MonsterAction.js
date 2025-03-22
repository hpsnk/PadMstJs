//----------------------------------------------------
// MonsterAction.js 
//----------------------------------------------------

// const url = require('url');
const ActionUtils = require('../util/ActionUtils');
const DatatablesUtils = require('../util/DatatablesUtils');

const MonsterService = require('../service/MonsterService');

const logger = require('../util/Logger');

//------------------------------
//------------------------------
exports.load = function () {
  logger.trace("[MonsterAction.js][load]start.");

  MonsterService.load();
}

//------------------------------
//------------------------------
exports.search = function (req, res) {
  logger.trace("[MonsterAction.js][search]start.");

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);

  logger.debug("  params=");
  logger.debug(JSON.stringify(params));

  if (params['start'] == undefined) {
    params['start'] = 0;
  } 
  if (params['length'] == undefined) {
    params['length'] = 10;
  }

  // monster一覧取得
  let monsterList = MonsterService.list();
  logger.debug("  monster size:" + monsterList.length);

  // 検索条件に沿ってフィルターする
  let filteredMonsterList = MonsterService.filter(params, monsterList);
  logger.debug("  [filter]monster size:" + filteredMonsterList.length);

  // sort
  let sortedMonsterList = MonsterService.sort(params, filteredMonsterList);
  logger.debug("  [sort]monster size:" + sortedMonsterList.length);

  // subArray
  let objSubArray = DatatablesUtils.subArray(sortedMonsterList, params);
  logger.debug("  [subArray]monster size:" + objSubArray.length);

  // fill skill
  MonsterService.fillSkillInfo(objSubArray['data']);

  // fill leaderskill
  MonsterService.fillLeaderSkillInfo(objSubArray['data']);
  
  let resObj = {
    'data': objSubArray.data,
    'draw': params['draw'],
    'recordsFiltered': objSubArray.recordsFiltered,//符合条件的件数
    'recordsTotal': objSubArray.recordsTotal//总件数
  };

  ActionUtils.doResponse(params, res, JSON.stringify(resObj));
}



//------------------------------
//------------------------------
exports.search4dt = function (req, res) {
  logger.trace("[MonsterAction.js][search4dt]start.");

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);

  logger.debug("  params=");
  logger.debug(JSON.stringify(params));

  // monster一覧取得
  let monsterList = MonsterService.list();

  // 検索条件に沿ってフィルターする
  let filteredMonsterList = MonsterService.filter(params, monsterList);

  // sort
  let sortedMonsterList = MonsterService.sort(params, filteredMonsterList);

  // subArray
  let objSubArray = DatatablesUtils.subArray(sortedMonsterList, params);

  // fill skill
  MonsterService.fillSkillInfo(objSubArray['data']);

  // fill leaderskill
  MonsterService.fillLeaderSkillInfo(objSubArray['data']);

  let resObj = {
    'data': objSubArray.data,
    'draw': params['draw'],
    'recordsFiltered': objSubArray.recordsFiltered,//符合条件的件数
    'recordsTotal': objSubArray.recordsTotal//总件数
  };

  ActionUtils.doResponse(params, res, JSON.stringify(resObj));
}

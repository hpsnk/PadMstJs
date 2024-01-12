//----------------------------------------------------
// LeaderSkillAction.js 
//----------------------------------------------------

const ActionUtils = require('../util/ActionUtils');
const logger = require('../util/Logger');
//const DatatablesUtils = require('../util/DatatablesUtils');
const ArrayUtils = require('../util/ArrayUtils');

const LeaderSkillService = require('../service/LeaderSkillService');

//------------------------------
//------------------------------
exports.search = function (req, res) {
  logger.trace("[LeaderSkillAction.js][search]start.");

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);
  logger.debug("  params=" + JSON.stringify(params));

  // 一覧取得
  let leaderSkillList = LeaderSkillService.list();
  logger.debug("  leaderSkillList.length=" + leaderSkillList.length);

  // 検索条件に沿ってフィルターする
  let filteredLeaderSkillList = LeaderSkillService.filter(params, leaderSkillList);
  logger.debug("  filteredLeaderSkillList.length=" + filteredLeaderSkillList.length);

  // subArray
  let objSubArray = ArrayUtils.subArrayForPaging(filteredLeaderSkillList, params);
  // logger.debug("  objSubArray=");
  // logger.debug(objSubArray);

  // レスポンス
  if (params['datatables'] == undefined || params['datatables'] == '0') {
    // datatables仕様ではない場合
    ActionUtils.doResponse(params, res, JSON.stringify(objSubArray));
  } else {
    // datatables仕様の場合
    let resObj = {
      'data': objSubArray,
      // 'draw': params['draw'],
      'recordsFiltered': filteredLeaderSkillList.length, //符合条件的件数
      'recordsTotal': leaderSkillList.length //总件数
    };

    ActionUtils.doResponse(params, res, JSON.stringify(resObj));
  }
}

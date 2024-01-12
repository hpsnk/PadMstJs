//----------------------------------------------------
//SkillAction.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const SkillService = require('../service/SkillService');

const ActionUtils = require('../util/ActionUtils');
const DatatablesUtils = require('../util/DatatablesUtils');

exports.search = function (req, res) {
  logger.trace("[SkillAction.js][search]start.");

  //logger.debug("req.header=" + req.header('Origin'));
  // logger.debug("req=" + JSON.stringify(JSON.parse(JSON.stringify(req))));

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);

  // skill一覧取得
  let skillList = SkillService.search(params);

  // 検索条件に沿ってフィルターする
  let filteredSkillList = SkillService.filter(params, skillList);

  // subArray
  let objSubArray = DatatablesUtils.subArray(filteredSkillList, params);

  ActionUtils.doResponse(params, res, JSON.stringify(objSubArray));
}

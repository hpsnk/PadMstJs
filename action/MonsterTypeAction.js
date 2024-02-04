//----------------------------------------------------
// MonsterTypeAction.js 
//----------------------------------------------------

const logger = require('../util/Logger');
const ActionUtils = require('../util/ActionUtils');

const MonsterTypeService = require('../service/MonsterTypeService')

const fs = require('fs');

exports.list = function (req, res) {
  logger.trace("[MonsterTypeAction.js][list]start.");

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);

  let objMonsterType = MonsterTypeService.list();

  ActionUtils.doResponse(params, res, JSON.stringify(objMonsterType));

}

exports.list4Cros = function (req, res) {
  logger.trace("[MonsterTypeAction.js][list4Cros]start.");

  // 解析 url 参数
  let params = ActionUtils.analyzeParam(req);
  // logger.debug(JSON.stringify(params));

  let objMonsterType = MonsterTypeService.list();

  ActionUtils.doResponse(params, res, JSON.stringify(objMonsterType));
}

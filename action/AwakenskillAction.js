//----------------------------------------------------
// AwakenskillAction.js 
//----------------------------------------------------

const url = require('url');
const ActionUtils = require('../util/ActionUtils');
const AwakenskillService = require('../service/AwakenskillService');

const logger = require('../util/Logger');


// const ArrayUtils = require('./util/ArrayUtils');
const DtUtils = require('../util/DatatablesUtils');

//------------------------------
//------------------------------
exports.listWithCros = function (req, res) {
  logger.trace("[AwakenskillAction.js][listWithCros]start.");

  // 解析 url 参数
  let params = url.parse(req.url, true).query;

  let objAwakenskill = AwakenskillService.list();

  // json -> string に変更
  let strAwakenskill = JSON.stringify(objAwakenskill);

  res.type('application/json');
  res.writeHeader(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });

  res.write(params['callback'] + '(' + strAwakenskill + ')');
  res.end();
}

exports.list = function (req, res) {
  logger.trace("[AwakenskillAction.js][list]start.");

  // 解析 url 参数
  let params = url.parse(req.url, true).query;
  // logger.debug("  params=");
  // logger.debug(JSON.stringify(params));

  // monster一覧取得
  let objAwakenskill = AwakenskillService.list();

  let resObj = {
    'data': objAwakenskill,
    'draw': params['draw'],
    'recordsFiltered': objAwakenskill.length,//符合条件的件数
    'recordsTotal': objAwakenskill.length//总件数
  };

  ActionUtils.doResponse(params, res, JSON.stringify(resObj));
}

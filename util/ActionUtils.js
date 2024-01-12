//-----------------------------------------------------
// ActionUtils.js
//-----------------------------------------------------

const url = require('url');

exports.analyzeParam = function (req) {
  // 解析 url 参数
  let params = url.parse(req.url, true).query;

  return params;
}

function isCrosRequest(reqParams) {
  if (reqParams['callback'] != undefined) {
    return true;
  }

  return false;
}

exports.doResponse = function (reqParams, res, strResponseData) {
  res.type('application/json');
  res.writeHeader(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'POST,GET,OPTIONS',
    'Access-Control-Allow-Headers':'AC-User-Agent, token, Content-Type',
    'Access-Control-Allow-Credentials':'false',
    'Content-Type': 'application/json'
  });

  if (isCrosRequest(reqParams)) {
    res.write(reqParams['callback'] + '(' + strResponseData + ')');
  } else {
    res.write(strResponseData);
  }

  res.end();
}

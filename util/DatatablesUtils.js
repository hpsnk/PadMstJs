//-----------------------------------------------------
//DatatablesUtil.js
//-----------------------------------------------------

const logger = require('../util/Logger');

//--containsAll----------------------------------------
//
//-----------------------------------------------------
exports.subArray = function (baseArray, params) {
  //subarray
  let targetData = [];

  // logger.debug(JSON.stringify(params));
  // logger.debug(params['start']);
  // logger.debug(params['length']);

  if (params['start'] == undefined || params['length'] == undefined) {
    return baseArray;
  }

  let numStart = Number(params['start']);
  let numLength = Number(params['length']);

  // console.log('start  : ' + numStart);
  // console.log('length : ' + numLength);

  // 总件数
  let numRecordsTotalCount = baseArray.length;

  let numDataStart = numStart;
  let numDataEnd = numStart + numLength;

  if (numDataEnd > numRecordsTotalCount) {
    numDataEnd = numRecordsTotalCount;
  }

  // console.log('real start  : ' + numDataStart);
  // console.log('real end    : ' + numDataEnd);

  // console.log('main attr   : ' + params['mainAttr[]']);

  for (i = numDataStart; i < numDataEnd; i++) {
    targetData.push(baseArray[i]);
  }

  let objResult = {
    data: targetData,
    draw: params['draw'],
    recordsFiltered: numRecordsTotalCount,//符合条件的件数
    recordsTotal: numRecordsTotalCount//总件数
  };

  return objResult;
}

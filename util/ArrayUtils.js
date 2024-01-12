//-----------------------------------------------------
//ArrayUtil.js
//-----------------------------------------------------

const logger = require('../util/Logger');

exports.countByContainsAny = function (baseArray, targetObj) {

  if (!Array.isArray(baseArray)) {
    throw 'baseArray must be an array object!';
  }

  let count = 0;

  //targetObj が Array の場合
  if (Array.isArray(targetObj)) {
    for (let idx = 0; idx < targetObj.length; idx++) {
      let subArray = baseArray.filter(function (x) {
        return x == targetObj[idx];
      });
      // console.log(targetObj[idx] + " : " + subArray.length);
      count += subArray.length;
    }
  }

  //targetObj が Array以外 の場合
  if (!Array.isArray(targetObj)) {

    let subArray = baseArray.filter(function (x) {
      return x == targetObj;
    });

    // console.log(targetObj + " : " + subArray.length);
    count += subArray.length;
  }

  return count;
}


//--containsAll----------------------------------------
//
//
//-----------------------------------------------------
exports.containsAll = function (baseArray, targetObj) {
  let isContainsAll = false;

  if (!Array.isArray(baseArray)) {
    throw 'baseArray must be an array object!';
  }

  //Arrayの場合
  if (Array.isArray(targetObj)) {
    let isContainsAllTarget = true;
    for (testIdx = 0; testIdx < targetObj.length; testIdx++) {
      if (baseArray.indexOf(targetObj[testIdx]) == -1) {
        isContainsAllTarget = false;
        break;
      }
    }
    if (isContainsAllTarget == true) {
      isContainsAll = true;
    }
  }

  //非Arrayの場合
  if (!Array.isArray(targetObj)) {
    //含まれない場合
    if (baseArray.indexOf(targetObj) != -1) {
      isContainsAll = true;
    }
  }

  return isContainsAll;
}

//--containsAny----------------------------------------
//
//
//-----------------------------------------------------
exports.containsAny = function (baseArray, targetObj) {
  let isContainsAny = false;

  if (!Array.isArray(baseArray)) {
    throw 'baseArray must be an array object!';
  }

  //Arrayの場合
  if (Array.isArray(targetObj)) {
    // console.log('    base is array');
    for (let testIdx = 0; testIdx < targetObj.length; testIdx++) {
      if (baseArray.indexOf(targetObj[testIdx]) != -1) {
        isContainsAny = true;
        break;
      }
    }
  }

  //非Arrayの場合
  if (!Array.isArray(targetObj)) {
    // console.log(typeof targetObj);

    // for (let i=0;i<baseArray.length;i++) {
    //   console.log(typeof baseArray[i]);
    // }

    // console.log('    base is not array');
    // console.log('    base     =' + baseArray);
    // console.log('    targetObj=' + targetObj);
    // console.log('    --------->' + baseArray.indexOf('3'));

    // 含まれる場合
    if (baseArray.indexOf(String(targetObj)) != -1 || baseArray.indexOf(Number(targetObj)) != -1) {
      isContainsAny = true;
    }
  }

  return isContainsAny;
}

//--toNumberArray--------------------------------------
//
//
//-----------------------------------------------------
exports.toNumberArray = function (fromObj) {
  let toArray = [];

  //非Arrayの場合
  if (!Array.isArray(fromObj)) {
    toArray.push(Number(fromObj));
  }

  //Arrayの場合
  if (Array.isArray(fromObj)) {
    for (convIdx = 0; convIdx < fromObj.length; convIdx++) {
      toArray.push(Number(fromObj[convIdx]));
    }
  }

  return toArray;
}


//--toNumberArray--------------------------------------
//
//
//-----------------------------------------------------
exports.subArrayForPaging = function (baseArray, params) {
  logger.trace("[ArrayUtil.js][subArrayForPaging]");

  // logger.debug(JSON.stringify(params));
  // logger.debug(params['start']);
  // logger.debug(params['length']);

  if (params['start'] == undefined || params['length'] == undefined) {
    logger.debug("  This is not a paging request.");
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

  //subarray
  let targetData = [];
  for (i = numDataStart; i < numDataEnd; i++) {
    targetData.push(baseArray[i]);
  }

  logger.debug("  input array length =" + baseArray.length);
  logger.debug("  sub array start    =" + numDataStart);
  logger.debug("  sub array end      =" + numDataEnd);
  logger.debug("  output array length=" + targetData.length);

  return targetData;

}

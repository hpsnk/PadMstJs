//-----------------------------------------------------
// Logger.js
//-----------------------------------------------------

exports.LV_TRACE = 1;
exports.LV_DEBUG = 2;
exports.LV_INFO = 3;
exports.LV_WARN = 4;
exports.LV_ERROR = 5;

let level = this.LV_INFO;

exports.setLevel = function (nLogLevel) {
  level = nLogLevel;
}

exports.trace = function (strLog) {
  outputLog(this.LV_TRACE, '[TRACE]' + strLog);
}

exports.debug = function (strLog) {
  outputLog(this.LV_DEBUG, '[DEBUG]' + strLog);
}

exports.info = function (strLog) {
  outputLog(this.LV_INFO, '[INFO ]' + strLog);
}

exports.warn = function (strLog) {
  outputLog(this.LV_WARN, '[WARN ]' + strLog);
}

exports.error = function (strLog) {
  outputLog(this.LV_ERROR, '[ERROR]' + strLog);
}

function outputLog(nLogLevel, strLog) {
  if (nLogLevel < level) {
    return;
  }
  console.log(getDisplayDateTime() + strLog);
}

function rightString(str, length) {
  return str.substring(str.length - length);
}

function getDisplayDateTime() {
  let now = new Date();

  let strYear = "" + now.getFullYear();
  let strMonth = rightString("00" + (now.getMonth() + 1), 2);
  let strDate = rightString("00" + now.getDate(), 2);
  let strHour = rightString("00" + now.getHours(), 2);
  let strMinute = rightString("00" + now.getMinutes(), 2);
  let strSecond = rightString("00" + now.getSeconds(), 2);
  let strMilliseconds = "" + now.getMilliseconds();

  return "[" + strYear + "/" +
    strMonth + "/" +
    strDate + " " +
    strHour + ":" +
    strMinute + ":" +
    strSecond + "." +
    strMilliseconds + "]";
}

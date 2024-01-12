//-----------------------------------------------------
// StringUtils.js
//-----------------------------------------------------
exports.isEmpty = function (str) {
    if (str == undefined || str == "") {
        return true;
    }
    return false;
}

exports.isNotEmpty = function (str) {
    return !this.isEmpty(str);
}

exports.equals = function (base, expect) {
    return base == expect;
}

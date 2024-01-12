//----------------------------------------------------
// TeamAction.js
//----------------------------------------------------

const logger = require('../util/Logger');

const TeamService = require('../service/TeamService');
const MonsterService = require('../service/MonsterService');

const ActionUtils = require('../util/ActionUtils');
const DatatablesUtils = require('../util/DatatablesUtils');

exports.list = function (req, res) {

}

exports.list4Datatables = function (req, res) {
    logger.trace("[TeamAction.js][list4Datatables]start.");

    // 解析 url 参数
    let params = ActionUtils.analyzeParam(req);

    // team一覧取得
    let teamList = TeamService.list();
    // console.log(teamList);

    // subArray
    let objSubArray = DatatablesUtils.subArray(teamList, params);

    // let resObj = {
    //     'data': objSubArray,
    //     'draw': params['draw'],
    //     'recordsFiltered': objSubArray.recordsFiltered,//符合条件的件数
    //     'recordsTotal': objSubArray.recordsTotal//总件数
    // };

    ActionUtils.doResponse(params, res, JSON.stringify(objSubArray));
}

exports.addCheck = function (req, res) {
    logger.trace("[TeamAction.js][addCheck]start.");

    let params = ActionUtils.analyzeParam(req);
    // console.log(params);

    let objMemberIn = TeamService.getCheckInInfo(params);
    // console.log(objMemberIn);

    let objMemberOut = MonsterService.getTeamMonsterInfo(objMemberIn);
    // console.log(objMemberOut);

    // sum awakenskill info
    let objMemberOut2 = TeamService.updateAwakenskillInfo(objMemberOut);
    objMemberOut2.awakenskillInfo = Array.from(objMemberOut2.awakenskillInfo.entries());
    //console.log("xxx:" + JSON.stringify(objMemberOut2.awakenskillInfo));

    ActionUtils.doResponse(params, res, JSON.stringify(objMemberOut));
}


exports.add = function (req, res) {
    logger.trace("[TeamAction.js][add]start.");

    let params = ActionUtils.analyzeParam(req);
    // console.log(params);

    let objMemberIn = TeamService.getCheckInInfo(params);
    // console.log(objMemberIn);

    let teamId = TeamService.getNextTeamId();

    let objTeamInfo = {
        'id': teamId,
        'name': params['name'],
        'type': params['type'],
        'member1p': objMemberIn['member1p'],
        'assist1p': objMemberIn['assist1p']
    };
    logger.debug(objTeamInfo);

    TeamService.save(objTeamInfo);

    ActionUtils.doResponse(params, res, JSON.stringify(objTeamInfo));
}


exports.update = function (req, res) {
    logger.trace("[TeamAction.js][update]start.");

    let params = ActionUtils.analyzeParam(req);
    // console.log(params);

    // let objMemberIn = TeamService.getCheckInInfo(params);
    // // console.log(objMemberIn);

    // let objMemberOut = MonsterService.getTeamMonsterInfo(objMemberIn);
    // // console.log(objMemberOut);

    // // sum awakenskill info
    // let objMemberOut2 = TeamService.updateAwakenskillInfo(objMemberOut);
    // objMemberOut2.awakenskillInfo = Array.from(objMemberOut2.awakenskillInfo.entries());
    // //console.log("xxx:" + JSON.stringify(objMemberOut2.awakenskillInfo));

    // ActionUtils.doResponse(params, res, JSON.stringify(objMemberOut));

    // // res.end();
}

exports.delete = function (req, res) {
    logger.trace("[TeamAction.js][delete]start.");

    let params = ActionUtils.analyzeParam(req);
    // console.log(params);

    // let objMemberIn = TeamService.getCheckInInfo(params);
    // // console.log(objMemberIn);

    // let objMemberOut = MonsterService.getTeamMonsterInfo(objMemberIn);
    // // console.log(objMemberOut);

    // // sum awakenskill info
    // let objMemberOut2 = TeamService.updateAwakenskillInfo(objMemberOut);
    // objMemberOut2.awakenskillInfo = Array.from(objMemberOut2.awakenskillInfo.entries());
    // //console.log("xxx:" + JSON.stringify(objMemberOut2.awakenskillInfo));

    // ActionUtils.doResponse(params, res, JSON.stringify(objMemberOut));

    // // res.end();
}

exports.detail = function (req, res) {
    logger.trace("[TeamAction.js][detail]start.");

    let params = ActionUtils.analyzeParam(req);
    // logger.debug(params);

    let objTeam = TeamService.detail(params['id']);
    // logger.debug(objTeam);

    ActionUtils.doResponse(params, res, JSON.stringify(objTeam));

}

//----------------------------------------------------
// TeamService.js 
//----------------------------------------------------

const logger = require('../util/Logger');

const MonsterDao = require('../dao/MonsterDao');
const AwakenskillDao = require('../dao/AwakenskillDao');
const daoTeam = require('../dao/TeamDao');

exports.save = function (objTeamInfo) {
    logger.trace("[TeamService.js][save]start.");

    // todo:id採番

    let allTeam = daoTeam.load();

    console.log("allTeam=");
    console.log(allTeam);


    allTeam.push(objTeamInfo);

    console.log("allTeam=");
    console.log(allTeam);

    // dao.save
    daoTeam.save(allTeam);
}

exports.delete = function () {
}

exports.update = function () {
}

exports.list = function () {
    logger.trace("[TeamService.js][list]start.");

    return daoTeam.load();
}

exports.detail = function (teamId) {
    logger.trace("[TeamService.js][detail]start.");

    let objTeam = undefined;

    let teamList = this.list();
    teamList.forEach(element => {
        if (element.id != undefined && element.id == teamId) {
            // let testId = Number(element.id);
            // if (testId > maxId) {
            //     maxId = testId;
            // }
            objTeam = element;
        }
    });

    return objTeam;
}

exports.getCheckInInfo = function (params) {
    logger.trace("[TeamService.js][getCheckInInfo]start.");

    // console.log('request params:');
    // console.log(objTeamInfo);

    let objMemberIn = {
        'member1p': [],
        'assist1p': [],
        'member2p': [],
        'assist2p': [],
        'member3p': [],
        'assist3p': []
    };

    //member1p
    objMemberIn.member1p.push(params['member1p[p1]']);
    objMemberIn.member1p.push(params['member1p[p2]']);
    objMemberIn.member1p.push(params['member1p[p3]']);
    objMemberIn.member1p.push(params['member1p[p4]']);
    objMemberIn.member1p.push(params['member1p[p5]']);
    objMemberIn.member1p.push(params['member1p[p6]']);

    //assist1p
    objMemberIn.assist1p.push(params['assist1p[p1]']);
    objMemberIn.assist1p.push(params['assist1p[p2]']);
    objMemberIn.assist1p.push(params['assist1p[p3]']);
    objMemberIn.assist1p.push(params['assist1p[p4]']);
    objMemberIn.assist1p.push(params['assist1p[p5]']);
    objMemberIn.assist1p.push(params['assist1p[p6]']);

    // console.log('process info:');
    // console.log(objMemberIn);

    return objMemberIn;
}

exports.updateAwakenskillInfo = function (objMemberOut) {
    console.log("[TeamService.js][updateAwakenskillInfo]start.");

    // console.log(objMemberOut);

    prepareAwakenskillMap(objMemberOut);

    //member1p
    for (let i = 0; i < objMemberOut.member1p.length; i++) {

        if (objMemberOut.member1p[i] != undefined) {
            let awakenskillIds = objMemberOut.member1p[i].awakenskillIds;

            for (let j = 0; j < awakenskillIds.length; j++) {
                let tId = awakenskillIds[j];
                let tCnt = objMemberOut.awakenskillInfo.get(tId);
                objMemberOut.awakenskillInfo.set(tId, tCnt + 1);

                // console.log("set[" + tId + "]--->" + (tCnt + 1));
                // console.log(objMemberOut.awakenskillInfo);

            }

        }
    }
    // console.log("count end");
    // console.log(objMemberOut.awakenskillInfo);

    // console.log("zzz:" + JSON.stringify(objMemberOut));

    // console.log("yyy:" + JSON.stringify(objMemberOut.awakenskillInfo.get(21)));

    return objMemberOut;
}

function prepareAwakenskillMap(objMemberOut) {
    logger.trace("[TeamService.js][prepareAwakenskillMap]start.");

    // console.log(objMemberOut);

    let awakenskillList = AwakenskillDao.load();

    objMemberOut.awakenskillInfo = new Map();

    // console.log(objMemberOut);

    for (let i = 0; i < awakenskillList.length; i++) {
        objMemberOut.awakenskillInfo.set(awakenskillList[i].awakenskillId, 0);
    }
}

exports.getNextTeamId = function () {
    logger.trace("[TeamService.js][getNextTeamId]start.");

    //test
    let maxId = daoTeam.getMaxTeamId();
    logger.debug("MaxId=" + maxId);

    return maxId + 1;
}

//----------------------------------------------------
// TeamDao.js
//----------------------------------------------------

const fs = require('fs');

const logger = require('../util/Logger');

const TARGET_FILE = './json_customer/team.json';

exports.load = function () {
    logger.trace("[TeamDao.js][load]start.");

    let objTeam;

    if (!fs.existsSync(TARGET_FILE)) {
        objTeam = [];
    } else {
        //read from file
        let strTeam = fs.readFileSync(TARGET_FILE);

        // string -> json に変更
        objTeam = JSON.parse(strTeam);
        console.log("json data length=" + objTeam.length);
    }

    return objTeam;
}

exports.save = function (objAllTeamInfo) {
    logger.trace("[TeamDao.js][save]start.");

    console.log("save team info:");
    console.log(objAllTeamInfo);

    // json -> string に変更
    let strAllTeam = JSON.stringify(objAllTeamInfo);

    // write into file
    fs.writeFileSync(TARGET_FILE, strAllTeam);
}

exports.getMaxTeamId = function () {
    logger.trace("[TeamDao.js][getMaxTeamId]start.");

    let maxId = 0;

    let teamList = this.load();
    logger.debug(teamList);

    teamList.forEach(element => {
        if (element.id != undefined) {
            let testId = Number(element.id);
            if (testId > maxId) {
                maxId = testId;
            }
        }
    });

    return maxId;
}

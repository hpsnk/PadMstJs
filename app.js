//----------------------------------------------------
// PadMstJs
// app.js
//----------------------------------------------------

// logger
const logger = require('./util/Logger');
// set log level
let execArgs = process.argv;
if (execArgs.length > 2 && execArgs[2] == 'debug') {
  logger.setLevel(logger.LV_TRACE);
}

//
if (process.env.hpsnk_padmst_json_dir == undefined) {
  console.error("  Set System Environment First.");
  console.error("    hpsnk_padmst_json_dir");
  process.exit(1);
} else {  
  console.log("  USING DATA DIR:");
  console.log("    %s", process.env.hpsnk_padmst_json_dir);
}

const CONFIG = require('./config')

const express = require("express")
const app = express()
const PORT = process.env.PORT || CONFIG.SERVER_PORT

//--action
const SkillAction = require('./action/SkillAction');
const MonsterAction = require('./action/MonsterAction');
const MonsterAttrAction = require('./action/MonsterAttrAction');
const MonsterTypeAction = require('./action/MonsterTypeAction');
const AwakenSkillAction = require('./action/AwakenskillAction');
const TeamAction = require('./action/TeamAction');
const CollaboAction = require('./action/CollaboAction');
const SkillCategoryAction = require('./action/SkillCategoryAction');
const LeaderSkillCategoryAction = require('./action/LeaderSkillCategoryAction');
const LeaderSkillAction = require('./action/LeaderSkillAction');

MonsterAction.load();

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// AXIOSに対してCORS対策
app.use(function (req, res, next) {
  if (req.method == 'OPTIONS') {
    // OPTIONSリクエストの場合
    // 早期リターン
    logger.debug("[app.js][options]response for preflight.");

    res.setHeader('Access-Control-Allow-Headers', 'crossdomain,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Credentials, AC-User-Agent, token, Content-Type');

    res.setHeader('crossdomain', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

    res.status(200).end();
  } else {
    // 通常リクエストの場合
    // 後継処理を行う
    logger.debug("[app.js][options]do next");
    next();
  }
});

//--OK--AwakenSkill--------------------
app.get('/padmst/awakenskill/list', function (req, res) {
  logger.trace("[app.js]awakenskill/list");

  AwakenSkillAction.list(req, res);
});

//--OK--Collabo------------------------
app.get('/padmst/collabo/list', function (req, res) {
  logger.trace("[app.js]collabo/list");

  CollaboAction.list(req, res);
});

//--OK--MonsterAttr--------------------
app.get('/padmst/attr/list', function (req, res) {
  logger.trace("[app.js]attr/list");

  MonsterAttrAction.list(req, res);
});


//--monster-----------------------
app.get('/padmst/monster/list', function (req, res) {
  logger.trace("[app.js][get]request monster/list");

  MonsterAction.search(req, res);
});



//--skill-------------------------
app.get('/padmst/skill/list', function (req, res) {
  logger.trace("[app.js][get]request skill/list");

  SkillAction.search(req, res);
});


app.get('/padmst/monster/list4dt', function (req, res) {
  logger.trace("[app.js]request monster/list4dt");

  MonsterAction.search4dt(req, res);
});

//--type--------------------------
app.get('/padmst/cros/type/list', function (req, res) {
  logger.trace("[app.js]request cros/type/list");

  MonsterTypeAction.list4Cros(req, res);
});

//--awakenskill-------------------
app.get('/padmst/cros/awakenskill/list', function (req, res) {
  logger.trace("[app.js]request cros/awakenskill/list");

  AwakenSkillAction.listWithCros(req, res);
});

app.get('/padmst/cros/awakenskill/list4dt', function (req, res) {
  logger.trace("[app.js]request cros/awakenskill/list4dt");

  //AwakenSkillAction.list4DatatablesWithCros(req, res, awakenskillList);
});

//--team---------------------------
app.get('/padmst/team/list4dt', function (req, res) {
  logger.trace("[app.js]request team/list4dt");

  TeamAction.list4Datatables(req, res);
});

app.get('/padmst/team/addCheck', function (req, res) {
  logger.trace("[app.js]request team/addCheck");

  TeamAction.addCheck(req, res);
});

app.get('/padmst/team/add', function (req, res) {
  logger.trace("[app.js]request team/add");

  TeamAction.add(req, res);
});

app.get('/padmst/team/detail', function (req, res) {
  logger.trace("[app.js]request team/detail");

  TeamAction.detail(req, res);
});

//--SkillCategory------------------
app.get('/padmst/skillCategory/list', function (req, res) {
  logger.trace("[app.js]request skillCategory/list");

  SkillCategoryAction.list(req, res);
});

//--LeaderSkillCategory------------
app.get('/padmst/leaderSkillCategory/list', function (req, res) {
  logger.trace("[app.js]leaderSkillCategory/list");

  LeaderSkillCategoryAction.list(req, res);
});

//--LeaderSkill--------------------
app.get('/padmst/leaderSkill/search', function (req, res) {
  logger.trace("[app.js]leaderSkill/search");

  LeaderSkillAction.search(req, res);
});

//--listen start-------------------
app.listen(PORT, () => {
  logger.info(`  listening at http://localhost:${PORT}`);
})

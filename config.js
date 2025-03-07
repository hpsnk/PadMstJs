//----------------------------------------------------
// PadMstJs
// config.js
//----------------------------------------------------

// 监听端口
exports.SERVER_PORT = 3000;

exports.API_ROOT_PATH = '/padmst';

const ENV_JSON_DIR = process.env.hpsnk_padmst_json_dir;
exports.DATA_FILES = {
    AWAKEN_SKILL:          ENV_JSON_DIR + '/awakenskill.json',
    COLLABO:               ENV_JSON_DIR + '/collabo.json',
    LEADER_SKILL:          ENV_JSON_DIR + '/leaderskill.json',
    LEADER_SKILL_CATEGORY: ENV_JSON_DIR + '/leaderskillcategory.json',
    MONSTER:               ENV_JSON_DIR + '/monster.json',
    MONSTER_ATTR:          ENV_JSON_DIR + '/attr.json',
    MONSTER_TYPE:          ENV_JSON_DIR + '/monster_type.json',
    SKILL:                 ENV_JSON_DIR + '/skill.json',
    SKILL_CATEGORY:        ENV_JSON_DIR + '/skillcategory.json',
    SKILL_TAG:             ENV_JSON_DIR + '/skill_tag.json',
    SUPER_AWAKEN_SKILL:    ENV_JSON_DIR + '/superawakenskill.json',
    TEAM: './json_customer/team.json',
}

const postingBase = require("../like-bot");
require("dotenv").config();

const config = {
	login: process.env.JANNA_LOGIN,
	password: process.env.JANNA_PASSWORD,
};

const start = () => {
	postingBase.start(config);
};

module.exports.start = start;

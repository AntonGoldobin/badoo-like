const postingBase = require("../like-bot");
require("dotenv").config();

const config = {
	login: process.env.TATYANA_LOGIN,
	password: process.env.TATYANA_PASSWORD,
	likingHour: 15,
};

const start = () => {
	postingBase.start(config);
};

module.exports.start = start;

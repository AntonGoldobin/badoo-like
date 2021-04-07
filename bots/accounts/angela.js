const postingBase = require("../like-bot");
require("dotenv").config();

const config = {
	login: process.env.ANGELA_LOGIN,
	password: process.env.ANGELA_PASSWORD,
	likingHour: 16,
};

const start = () => {
	postingBase.start(config);
};

module.exports.start = start;

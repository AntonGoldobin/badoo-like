const likes = require("../like-bot");
const replyLikes = require("../reply-like-bot");
require("dotenv").config();

const config = {
	login: process.env.ANGELA_LOGIN,
	password: process.env.ANGELA_PASSWORD,
	likingHour: 16,
	replyLikingHour: 17,
	messageHour: 18,
};

const start = () => {
	likes.start(config);
	// replyLikes.start(config);
};

module.exports.start = start;

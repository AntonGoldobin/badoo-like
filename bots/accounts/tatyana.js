const likes = require("../like-bot");
const replyLikes = require("../reply-like-bot");
require("dotenv").config();

const config = {
	login: process.env.TATYANA_LOGIN,
	password: process.env.TATYANA_PASSWORD,
	likingHour: 16,
	replyLikingHour: 15,
	messageHour: 17,
};

const start = () => {
	// likes.start(config);
	replyLikes.start(config);
};

module.exports.start = start;

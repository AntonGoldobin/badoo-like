require("dotenv").config();

const config = () => {
	return {
		popupClasses: [
			".js-chrome-pushes-allow",
			".js-ovl-close",
			".js-chrome-pushes-deny",
			".ovl__close",
			".js-continue",
		],
		puppeteerConfig: {
			headless: process.env.VERSION == "DEVELOPMENT" ? false : true,
			defaultViewport: null,
			slowMo: 5,
			args: [
				"--disable-gpu",
				"--disable-dev-shm-usage",
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--no-first-run",
				"--no-zygote",
				// "--single-process",
			],
		},
	};
};

module.exports.config = config;

const puppeteer = require("puppeteer");
require("dotenv").config();
const cron = require("node-cron");
const universalConfig = require("./config/config");

const imagesEnabled = false;
let dailySchedule = null;

const start = (config) => {
	dailySchedule = cron.schedule(`0 ${config.likingHour} * * *`, () => {
		startLiking(config);
	});
};

const startLiking = async (params) => {
	const browser = await puppeteer.launch(universalConfig.config().puppeteerConfig);
	const page = await browser.newPage();

	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (!imagesEnabled && request.resourceType() === "image") request.abort();
		else request.continue();
	});

	await page.goto("https://badoo.com/signin/", { waitUntil: "networkidle2" });

	await page.type(".js-signin-login", params.login);
	await page.type(".js-signin-password", params.password);
	await page.click(".new-form__actions .btn--block");

	await page.evaluate(() => {
		// untrusted
		// document.querySelector('.profile-action--color-yes').click();
	});
	const likeBtn = ".profile-action--color-yes";

	let likesCount = 0;
	while (likesCount < 300) {
		await new Promise((_) => setTimeout(_, 1000)); // pause
		console.log(await page.url());
		try {
			await page.waitForSelector(likeBtn, { timeout: 1000 });
			await page.click(likeBtn);
		} catch (err) {
			console.log(err.message);
		}
		const popups = universalConfig.config().popupClasses.map(async (selector) => {
			try {
				await page.waitForSelector(selector, { timeout: 1000 });
				await page.click(selector);
			} catch (err) {
				console.log(err.message);
			}
		});
		likesCount++;
		await Promise.all(popups);
	}
	await browser.close();
};

module.exports.start = start;

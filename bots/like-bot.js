const puppeteer = require("puppeteer");
require("dotenv").config();
const cron = require("node-cron");

const imagesEnabled = false;
let dailySchedule = null;

const start = (config) => {
	dailySchedule = cron.schedule(`0 ${config.likingHour} * * *`, () => {
		startLiking(config);
	});
};

const startLiking = async (params) => {
	const browser = await puppeteer.launch({
		headless: true,
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
	});
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
	while (likesCount < 200) {
		await new Promise((_) => setTimeout(_, 1000)); // pause

		try {
			await page.waitForSelector(likeBtn, { timeout: 1000 });
			await page.click(likeBtn);
		} catch (err) {
			console.log(err.message);
		}
		const popups = [ ".js-ovl-close", ".js-chrome-pushes-deny", ".ovl__close" ].map(async (selector) => {
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

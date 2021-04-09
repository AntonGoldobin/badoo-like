const puppeteer = require("puppeteer");
require("dotenv").config();
const cron = require("node-cron");

const imagesEnabled = false;

const start = (config) => {
	dailySchedule = cron.schedule(`0 ${config.replyLikingHour} * * *`, () => {
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
	await page.waitForNavigation({ waitUntil: "networkidle2" });

	let pageCount = 1;
	let hasLikes = true;

	while (hasLikes) {
		await page.goto(`https://badoo.com/liked-you/${pageCount}`, { waitUntil: "networkidle2" });
		const popups = [
			".js-chrome-pushes-allow",
			".js-ovl-close",
			".js-chrome-pushes-deny",
			".ovl__close",
		].map(async (selector) => {
			try {
				await page.waitForSelector(selector, { timeout: 1000 });
				await page.click(selector);
			} catch (err) {
				console.log(err.message);
			}
		});

		await Promise.all(popups);

		const likeBtns = await page.$$(".user-card__action--yes");

		if ((await likeBtns.length) == 0) {
			hasLikes = false;
			break;
		}

		const likeBtnsPromises = likeBtns.map(async (likeBtn, i) => {
			await new Promise((_) => setTimeout(_, 1000 * i)); // pause
			await likeBtn.click();
		});

		await Promise.all(likeBtnsPromises);

		await pageCount++;
	}
	await browser.close();
};

module.exports.start = start;

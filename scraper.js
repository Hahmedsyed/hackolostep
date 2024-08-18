const axios = require('axios');
const cheerio = require('cheerio');
const ScrapedData = require('./models/ScrapedData');

async function scrapeWebsite(url) {
    try {
        // Perform a basic GET request to the URL
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const headings = [];
        $('h1, h2, h3').each((index, element) => {
            headings.push($(element).text().trim());
        });

        const paragraphs = [];
        $('p').each((index, element) => {
            paragraphs.push($(element).text().trim());
        });

        const images = [];
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src) images.push(src);
        });

        const links = [];
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const text = $(element).text().trim();
            if (href) links.push({ text, href });
        });

        const scrapedData = new ScrapedData({
            url,
            headings,
            paragraphs,
            images,
            links,
        });

        return scrapedData;

    } catch (error) {
        console.error('Complete error object:', error);

        if (error.code === 'ENOTFOUND' || error.message.includes('ENOTFOUND')) {
            console.error('Domain not found:', error.message);
            throw new Error('The domain could not be found. Please check the URL and try again.');
        } else if (error.response && error.response.status === 404) {
            console.error('Page not found (404):', error.message);
            throw new Error('The requested page could not be found. Please check the URL and try again.');
        } else {
            console.error('Error scraping the website:', error.message);
            throw new Error('Failed to scrape the website. Please check the URL and try again.');
        }
    }
}

module.exports = scrapeWebsite;

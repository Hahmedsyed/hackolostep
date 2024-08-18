const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const ScrapedData = require('./models/ScrapedData');
const connectDB = require('./utils/db');

// Connect to MongoDB
connectDB();

async function scrapeWebsite(url) {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(data);

        // Extract the data you want to store
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

        // Save the scraped data to MongoDB
        const scrapedData = new ScrapedData({
            url,
            headings,
            paragraphs,
            images,
            links,
        });
        await scrapedData.save();

        console.log('Data saved successfully:', scrapedData);

    } catch (error) {
        // Handle specific errors
        if (error.response && error.response.status === 404) {
            console.error('Error: Page not found (404)');
        } else {
            console.error('Error scraping the website:', error.message);
        }
    }
}

// Test the scraper with an example URL
scrapeWebsite('https://example.com/nonexistentpage');
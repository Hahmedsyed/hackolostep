require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./utils/db');
const ScrapedData = require('./models/ScrapedData');
const scrapeWebsite = require('./scraper');  

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

connectDB();

app.post('/scrape', async (req, res) => {
    const url = req.body.url;

    try {
        const scrapedData = await scrapeWebsite(url);
        res.render('results', { data: scrapedData });
    } catch (error) {
        res.status(500).render('error', { message: error.message, fullError: JSON.stringify(error, null, 2) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
import morgan from 'morgan';
import logger from '@/utils/logger';
const connectDB = require('./utils/db');
const ScrapedData = require('./models/ScrapedData');
const scrapeWebsite = require('./scraper');  

const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // Log HTTP requests
app.set('view engine', 'ejs');
app.use((err, req, res, next) => {
    logger.error(`Unhandled Error: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  });

//Routes
app.use('/api/scrape', scrapeRouter);

connectDB();

app.get('/', (req, res) => {
    res.render('index');
});

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

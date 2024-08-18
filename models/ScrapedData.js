const mongoose = require('mongoose');

const ScrapedDataSchema = new mongoose.Schema({
    url: { type: String, required: true },
    headings: [String],
    paragraphs: [String],
    images: [String],
    links: [{ text: String, href: String }],
    scrapedAt: { type: Date, default: Date.now },
});

const ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

module.exports = ScrapedData;

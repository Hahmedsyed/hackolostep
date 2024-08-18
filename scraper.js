const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape a webpage based on the given URL
async function scrapeWebsite(url) {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(data);

        // Example 1: Extract the text of all headings (h1, h2, h3)
        const headings = [];
        $('h1, h2, h3').each((index, element) => {
            headings.push($(element).text().trim());
        });

        // Example 2: Extract all paragraphs
        const paragraphs = [];
        $('p').each((index, element) => {
            paragraphs.push($(element).text().trim());
        });

        // Example 3: Extract all image URLs
        const images = [];
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src) images.push(src);
        });

        // Example 4: Extract all links with their text
        const links = [];
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const text = $(element).text().trim();
            if (href) links.push({ text, href });
        });

        // Example 5: Extract content based on a specific class or ID
        const specialContent = $('.special-class').text().trim();  // Example for class
        const uniqueContent = $('#unique-id').text().trim();       // Example for ID

        // Log the extracted content
        console.log('Headings:', headings);
        console.log('Paragraphs:', paragraphs);
        console.log('Images:', images);
        console.log('Links:', links);
        console.log('Special Content:', specialContent);
        console.log('Unique Content:', uniqueContent);

    } catch (error) {
        // Handle errors gracefully
        console.error('Error scraping the website:', error.message);
    }
}

// Test the scraper with an example URL
scrapeWebsite('https://example.com');


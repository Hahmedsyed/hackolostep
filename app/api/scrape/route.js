import axios from 'axios';
import { load } from 'cheerio';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json(); // Parse the request body
    const { data } = await axios.get(url); // Fetch the HTML content from the URL
    const $ = load(data); // Load the HTML into Cheerio

    // Extract the headings, paragraphs, and images
    const headings = [];
    $('h1, h2, h3').each((_, element) => {
      headings.push($(element).text().trim());
    });

    const paragraphs = [];
    $('p').each((_, element) => {
      paragraphs.push($(element).text().trim());
    });

    const images = [];
    $('img').each((_, element) => {
      images.push($(element).attr('src'));
    });

    // Return the extracted data as a JSON response
    return NextResponse.json({ headings, paragraphs, images });
  } catch (error) {
    console.error('Error scraping the website:', error.message);
    return NextResponse.json({ message: 'Error scraping the website', error: error.message }, { status: 500 });
  }
}

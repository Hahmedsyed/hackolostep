"use client";

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (response.ok) {
        setData(result);
        setError(null);
      } else {
        setError(result.message);
        setData(null);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setData(null);
    }
  };

  return (
    <div>
      <h1>Enter a URL to Scrape</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Scrape</button>
      </form>
      {data && (
        <div>
          <h2>Scraped Data</h2>
          <h3>Headings:</h3>
          <ul>
            {data.headings.map((heading, index) => (
              <li key={index}>{heading}</li>
            ))}
          </ul>
          <h3>Paragraphs:</h3>
          <ul>
            {data.paragraphs.map((paragraph, index) => (
              <li key={index}>{paragraph}</li>
            ))}
          </ul>
          <h3>Images:</h3>
          <ul>
            {data.images.map((image, index) => (
              <li key={index}><img src={image} alt={`Image ${index + 1}`} /></li>
            ))}
          </ul>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

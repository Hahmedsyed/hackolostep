import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform the scrape operation here, or submit to an API route
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result = await response.json();
    console.log(result);  // Handle the result as needed
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
    </div>
  );
}


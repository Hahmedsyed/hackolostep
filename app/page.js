"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createModel, predictCategory } from '../utils/model';
import '../styles/styles.css';  // Import the CSS file for styling

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await createModel();
      setModel(loadedModel);
    }
    loadModel();
  }, []);

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
        if (model) {
          const categorizedData = {
            headings: result.headings,
            paragraphs: result.paragraphs,
            images: result.images,
          };
          setData(categorizedData);
        } else {
          setData(result);
        }
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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const renderContent = () => {
    if (!data || !activeCategory) return null;

    switch (activeCategory) {
      case 'headings':
        return (
          <ul className="content-list">
            {data.headings.map((heading, index) => (
              <li key={index}>{heading}</li>
            ))}
          </ul>
        );
      case 'paragraphs':
        return (
          <ul className="content-list">
            {data.paragraphs.map((paragraph, index) => (
              <li key={index}>{paragraph}</li>
            ))}
          </ul>
        );
      case 'images':
        return (
          <ul className="content-list images-list">
            {data.images.map((image, index) => (
              <li key={index}>
                <img src={image} alt={`Image ${index + 1}`} />
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Web Scraper</h1>
      </header>
      <main className="main-section">
        <form onSubmit={handleSubmit} className="url-form">
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
          <div className="content-container">
            <div className="button-group">
              <button onClick={() => handleCategoryClick('headings')}>Headings</button>
              <button onClick={() => handleCategoryClick('paragraphs')}>Paragraphs</button>
              <button onClick={() => handleCategoryClick('images')}>Images</button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {data && activeCategory && (
          <div className="scrape-return-container">
            <h2>Scrape Return</h2>
            <div className="scrape-return-content">
              {renderContent()}
            </div>
          </div>
        )}
      </main>
      <footer className="footer">
        <p>© 2024 Web Scraper. All rights reserved.</p>
      </footer>
    </div>
  );
}

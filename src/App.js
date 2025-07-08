import React, { useState } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use API key from environment variable
  const API_KEY = process.env.REACT_APP_API_NINJAS_KEY;

  const getQuote = async () => {
    setLoading(true);
    setError('');
    setQuote('');
    setAuthor('');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 seconds
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        method: 'GET',
        headers: { 'X-Api-Key': API_KEY },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0].quote);
        setAuthor(data[0].author);
      } else {
        setError('No quote found.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Could not fetch a quote. Please check your API key, internet connection, or try again later.');
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getQuote();
  }, []);

  return (
    <div className="quote-app-container">
      <h1 className="title">Quote Generator</h1>
      <div className="quote-box">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <p className="quote-text">"{quote}"</p>
            <p className="quote-author">- {author}</p>
          </>
        )}
      </div>
      <button className="generate-btn" onClick={getQuote} disabled={loading}>
        {loading ? 'Fetching...' : 'New Quote'}
      </button>
    </div>
  );
}

export default App;

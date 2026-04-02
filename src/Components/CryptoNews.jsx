import { useEffect, useState } from 'react'

const API_KEY = import.meta.env.VITE_APP_API_KEY

function CryptoNews() {
  // Keep the fetched news articles in state so the sidebar can render them.
  const [newsList, setNewsList] = useState(null)

  useEffect(() => {
    // Load recent crypto news for the sidebar pane.
    const fetchCryptoNews = async () => {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${API_KEY}`,
      )
      const data = await response.json()

      // Save the API response so the article list can render.
      setNewsList(data)
    }

    fetchCryptoNews().catch(console.error)
  }, [])

  return (
    <section className="crypto-news">
      <h2>Latest Crypto News</h2>
      <ul>
        {/* Show articles once they are available, otherwise show a loading message. */}
        {newsList?.Data?.length ? (
          newsList.Data.map((article) => (
            <li key={article.id} className="news-item">
              <a href={article.url} target="_blank" rel="noreferrer">
                {article.title}
              </a>
            </li>
          ))
        ) : (
          <li className="news-item">Loading news...</li>
        )}
      </ul>
    </section>
  )
}

export default CryptoNews
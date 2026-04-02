import { useEffect, useState } from 'react'

const API_KEY = import.meta.env.VITE_APP_API_KEY

function CoinInfo({ image, name, symbol, detailsUrl }) {
  // Each coin needs its own price, so we fetch it in the child component.
  const [price, setPrice] = useState(null)
  const coinHref = detailsUrl
    ? `https://www.cryptocompare.com${detailsUrl}`
    : `https://www.cryptocompare.com/search?q=${symbol}`

  useEffect(() => {
    // Fetch the live USD price for the coin represented by this row.
    const getCoinPrice = async () => {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`,
      )
      const data = await response.json()

      // Save the price so the UI can show it next to the coin name.
      setPrice(data)
    }

    getCoinPrice().catch(console.error)
  }, [symbol])

  return (
    <li className="main-list">
      <a
        className="coin-link"
        href={coinHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open more details about ${name}`}
      >
        {/* Use the image path from the API and build the full URL. */}
        <img
          className="icons"
          src={`https://www.cryptocompare.com${image}`}
          alt={`Small icon for ${name} crypto coin`}
        />
        {/* Show the coin name and its current USD price. */}
        <span className="coin-name">{name}</span>
        <span className="coin-price">
          {price?.USD !== undefined ? `$${price.USD} USD` : 'Loading price...'}
        </span>
      </a>
    </li>
  )
}

export default CoinInfo
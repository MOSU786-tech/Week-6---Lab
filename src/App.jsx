import { useEffect, useState } from 'react'
import CoinInfo from './Components/CoinInfo'
import SideNav from './Components/SideNav'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY

function App() {
  // Coin list data from CryptoCompare.
  const [list, setList] = useState(null)
  // Search results are stored separately so we can switch between filtered and full lists.
  const [filteredResults, setFilteredResults] = useState([])
  // Keeps track of what the user typed into the search bar.
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    // Load the coin list once when the page opens.
    const fetchAllCoinData = async () => {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=30&tsym=USD&api_key=${API_KEY}`,
      )
      const data = await response.json()

      // Save the API response so the UI can render the coins.
      setList(data)
      setFilteredResults(data.Data ?? [])
    }

    fetchAllCoinData().catch(console.error)
  }, [])

  const searchItems = (searchValue) => {
    // Store the latest search text so we can decide which list to show.
    setSearchInput(searchValue)
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!list?.Data) {
      return
    }

    if (normalizedSearch !== '') {
      // Match either symbol (BTC) or full name (Bitcoin) so search feels natural.
      const filteredData = list.Data.filter((item) =>
        item.CoinInfo.Name.toLowerCase().includes(normalizedSearch) ||
        item.CoinInfo.FullName.toLowerCase().includes(normalizedSearch),
      )

      setFilteredResults(filteredData)
    } else {
      setFilteredResults(list.Data)
    }
  }

  const visibleCoins = searchInput.length > 0 ? filteredResults : list?.Data ?? []
  const isLoading = list === null

  return (
    <div className="app-shell">
      {/* Fixed sidebar for optional crypto news content. */}
      <SideNav />

      <main className="whole-page">
        <h1>My Crypto List</h1>
        {/* Short helper text so the page explains what the search does. */}
        <p className="intro-text">
          Search by coin symbol to filter the list while the live data loads.
        </p>

        {/* Search input updates the filtered list as the user types. */}
        <input
          className="search-input"
          type="text"
          placeholder="Search by symbol or name..."
          value={searchInput}
          onChange={(inputString) => searchItems(inputString.target.value)}
        />

        {/* Show a loading state first so the page never looks empty. */}
        {isLoading ? (
          <div className="loading-card">Loading live crypto data...</div>
        ) : (
          // Render only coins that have real blockchain metadata.
          <ul className="coin-list">
            {visibleCoins
              .filter(
                (coinData) =>
                  coinData?.CoinInfo &&
                  coinData.CoinInfo.Algorithm !== 'N/A' &&
                  coinData.CoinInfo.ProofType !== 'N/A',
              )
              .map((coinData) => (
                <CoinInfo
                  key={coinData.CoinInfo.Name}
                  image={coinData.CoinInfo.ImageUrl}
                  name={coinData.CoinInfo.FullName}
                  symbol={coinData.CoinInfo.Name}
                  detailsUrl={coinData.CoinInfo.Url}
                />
              ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App

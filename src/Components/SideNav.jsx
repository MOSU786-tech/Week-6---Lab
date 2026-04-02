import CryptoNews from './CryptoNews'

function SideNav() {
  return (
    // Fixed left sidebar that holds extra crypto content.
    <aside className="sidenav">
      <h1>here is my side nav bar</h1>
      {/* News is rendered inside the sidebar so it stays visible while browsing coins. */}
      <CryptoNews />
    </aside>
  )
}

export default SideNav
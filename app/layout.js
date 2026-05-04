import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
          
          {/* Sidebar */}
          <nav style={{ 
            width: '260px', background: '#001529', color: '#fff', 
            display: 'flex', flexDirection: 'column', padding: '20px', flexShrink: 0 
          }}>
            <h2 style={{ color: '#1890ff', marginBottom: '40px' }}>🌊 MUKTODHARA</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/" style={navItemStyle}>📊 Dashboard</Link>
              <Link href="/manage" style={navItemStyle}>⚙️ Node Settings</Link>
              <Link href="/history" style={navItemStyle}>📜 Data History</Link>
              <Link href="/resources" style={navItemStyle}>👥 DCC Resources</Link>
            </div>
          </nav>

          {/* Main Content Area */}
          <main style={{ flex: 1, overflowY: 'auto', background: '#f0f2f5' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

const navItemStyle = {
  color: '#cbd5e1', textDecoration: 'none', padding: '12px 15px', 
  borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '14px'
};
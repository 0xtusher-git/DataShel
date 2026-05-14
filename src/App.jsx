import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Upload from './pages/Upload';
import MyDatasets from './pages/MyDatasets';

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <DataProvider>
          <ToastProvider>
            <div className="app-shell">
              <Navbar />
              <main className="app-main">
                <Routes>
                  <Route path="/"            element={<Home />} />
                  <Route path="/browse"      element={<Browse />} />
                  <Route path="/upload"      element={<Upload />} />
                  <Route path="/my-datasets" element={<MyDatasets />} />
                  <Route path="*"            element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </DataProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">404</div>
          <h3>Page not found</h3>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary btn-sm">Go Home</a>
        </div>
      </div>
    </div>
  );
}

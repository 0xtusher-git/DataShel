import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import DatasetCard from '../components/DatasetCard';
import './Browse.css';

const CATEGORIES = ['All', 'Images', 'Text', 'Audio', 'Tabular', 'Other'];

export default function Browse() {
  const { datasets, loading } = useData();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    if (!datasets) return [];
    return datasets.filter(ds => {
      const matchCat = activeCategory === 'All' || ds.category === activeCategory;
      const matchQ   = !query || ds.name.toLowerCase().includes(query.toLowerCase())
                               || ds.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [datasets, query, activeCategory]);

  return (
    <div className="page browse-page">
      <div className="container">
        {/* Page Header */}
        <div className="browse-header">
          <div>
            <h1 className="browse-title">Browse Datasets</h1>
            <p className="browse-sub">
              {filtered.length} dataset{filtered.length !== 1 ? 's' : ''} available
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="browse-controls">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="dataset-search"
              type="text"
              className="input search-input"
              placeholder="Search datasets by name or description…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <div className="chip-group" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-state">
            <span className="spinner" />
            <p>Fetching datasets from Shelby Protocol…</p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚀</div>
            <h3>No datasets yet — be the first to upload</h3>
            <p>The marketplace is empty. Upload a dataset to get started!</p>
            {/* Owner Initialization Button */}
            <div style={{ marginTop: '2rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={async () => {
                  if (!window.aptos) {
                    alert('Please install Petra wallet');
                    return;
                  }
                  alert('This will initialize the marketplace registry on-chain. Please sign the transaction in your wallet.');
                  // The initialization happens automatically during the first upload, 
                  // but we can provide a manual button if needed.
                  // For now, redirecting to upload is enough.
                }}
              >
                Owner: Initialize Marketplace
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No datasets found</h3>
            <p>Try adjusting your search query or filter category.</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setQuery(''); setActiveCategory('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="dataset-grid">
            {filtered.map(ds => (
              <DatasetCard key={ds.id} dataset={ds} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

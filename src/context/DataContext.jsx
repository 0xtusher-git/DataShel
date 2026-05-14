import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const SHELBY_API_BASE = "https://api.shelbynet.shelby.xyz/shelby";
const REGISTRY_ADDR = "0xd47a54e17b35414d87654a1d5e43f4d3f0000000"; // Global registry account

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dataset metadata from Shelby
  const fetchAllDatasets = async () => {
    setLoading(true);
    
    try {
      // Fetch list of blobs for the registry account
      const listUrl = `${SHELBY_API_BASE}/v1/blobs/${REGISTRY_ADDR}`;
      console.log('[DataShel] Fetching registry from:', listUrl);
      
      const listResponse = await fetch(listUrl);
      if (!listResponse.ok) throw new Error('Failed to fetch registry list');
      
      const blobList = await listResponse.json();
      
      // Fetch each metadata JSON
      const fetched = await Promise.all(
        blobList
          .filter(b => b.name.startsWith('metadata_'))
          .map(async (b) => {
            try {
              const res = await fetch(`${SHELBY_API_BASE}/v1/blobs/${REGISTRY_ADDR}/${b.name}`);
              if (!res.ok) return null;
              return await res.json();
            } catch (e) {
              console.error(`Failed to fetch metadata for ${b.name}:`, e);
              return null;
            }
          })
      );
      
      const validDatasets = fetched
        .filter(d => d !== null)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      
      console.log(`[DataShel] Loaded ${validDatasets.length} datasets from Shelby`);
      setDatasets(validDatasets);
    } catch (err) {
      console.error('Error fetching datasets from Shelby:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDatasets();
  }, []);

  const addDataset = (dataset) => {
    // Note: The actual upload to Shelby happens in Upload.jsx
    // Here we just update local state to reflect the new addition immediately
    setDatasets(prev => [dataset, ...prev]);
    return dataset;
  };

  const updateDataset = (id, changes) => {
    // In decentralized storage, updating usually means re-uploading metadata
    // For now, we update local state. In a real app, this would trigger a new Shelby PUT
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d));
  };

  const recordDownload = (id) => {
    setDatasets(prev => prev.map(d =>
      d.id === id ? { ...d, downloads: d.downloads + 1, earnings: d.earnings + d.price } : d
    ));
  };

  const totalStats = {
    listed: datasets.length,
    downloads: datasets.reduce((s, d) => s + (d.downloads || 0), 0),
  };

  return (
    <DataContext.Provider value={{ datasets, addDataset, updateDataset, recordDownload, totalStats, loading, refresh: fetchAllDatasets }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const SHELBY_API_BASE = "https://api.shelbynet.shelby.xyz/shelby";
const REGISTRY_ADDR = "0x000000000000000000000000d47a54e17b35414d87654a1d5e43f4d3f0000000"; // Global registry account

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dataset metadata from Shelby
  const fetchAllDatasets = async () => {
    setLoading(true);
    
    try {
      const listUrl = `${SHELBY_API_BASE}/v1/blobs/${REGISTRY_ADDR}/datashel-registry.json`;
      console.log('[DataShel] Fetching registry from:', listUrl);
      
      const API_KEY = import.meta.env.VITE_SHELBY_API_KEY;
      const headers = {
        'x-api-key': API_KEY
      };
      console.log('[DataShel] Sending headers for registry fetch:', headers);

      const listResponse = await fetch(listUrl, {
        headers: headers
      });

      if (!listResponse.ok) {
        if (listResponse.status === 404) {
          console.log('[DataShel] Registry not found, starting fresh.');
          setDatasets([]);
          return;
        }
        const errText = await listResponse.text();
        console.error(`[DataShel] Registry fetch failed (${listResponse.status}):`, errText);
        throw new Error(`Failed to fetch registry list (${listResponse.status})`);
      }
      
      const validDatasets = await listResponse.json();
      
      // Sort datasets by timestamp (newest first)
      if (Array.isArray(validDatasets)) {
        validDatasets.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        console.log(`[DataShel] Loaded ${validDatasets.length} datasets from Shelby`);
        setDatasets(validDatasets);
      } else {
        console.warn('[DataShel] Registry format is invalid. Resetting to empty array.');
        setDatasets([]);
      }
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

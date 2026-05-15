import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

import { supabase } from '../lib/supabase';

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dataset metadata from Supabase
  const fetchAllDatasets = async () => {
    setLoading(true);
    
    try {
      console.log('[DataShel] Fetching datasets from Supabase...');
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const validDatasets = data.map(ds => ({
        id: ds.id,
        name: ds.name,
        category: ds.category,
        description: ds.description,
        price: ds.price,
        uploader: ds.owner_address,
        filePath: ds.file_path,
        downloads: ds.download_count || 0,
        timestamp: new Date(ds.created_at).getTime(),
        size: 'MB' // Placeholder or omit if not in table
      }));
      
      console.log(`[DataShel] Loaded ${validDatasets.length} datasets from Supabase`);
      setDatasets(validDatasets);
    } catch (err) {
      console.error('Error fetching datasets from Supabase:', err);
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

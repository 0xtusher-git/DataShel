import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

// Seed mock datasets — in production these come from Shelby storage
const VALID_OWNER = '0x0000000000000000000000000000000000000000000000000000000000000001';

const SEED_DATASETS = [
  {
    id: '1',
    name: 'Open Instruction Dataset v2',
    category: 'Text',
    description: 'Curated 120k instruction-following pairs for LLM fine-tuning. Diverse tasks including QA, summarization, coding, and reasoning chains.',
    size: '1.8 GB',
    price: 25,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 142,
    earnings: 3550,
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: '2',
    name: 'COCO-style Image Annotations 2025',
    category: 'Images',
    description: 'Bounding boxes + segmentation masks for 85k urban environment images. YOLO-compatible labels included.',
    size: '14.2 GB',
    price: 80,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 87,
    earnings: 6960,
    timestamp: Date.now() - 86400000 * 12,
  },
  {
    id: '3',
    name: 'Multilingual Audio Speech Corpus',
    category: 'Audio',
    description: '500 hours of clean speech across 14 languages. Studio-quality WAV, 16kHz, with word-level transcriptions.',
    size: '38.5 GB',
    price: 150,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 34,
    earnings: 5100,
    timestamp: Date.now() - 86400000 * 20,
  },
  {
    id: '4',
    name: 'E-commerce Tabular Purchase Dataset',
    category: 'Tabular',
    description: 'Anonymized purchase sequences from 2M users across 18 months. Ideal for recommendation system training.',
    size: '4.1 GB',
    price: 45,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 211,
    earnings: 9495,
    timestamp: Date.now() - 86400000 * 8,
  },
  {
    id: '5',
    name: 'Medical Report NLP Corpus',
    category: 'Text',
    description: 'De-identified radiology and pathology reports (310k samples) with ICD-10 entity annotations for bioNLP.',
    size: '920 MB',
    price: 120,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 19,
    earnings: 2280,
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: '6',
    name: 'Drone Aerial Imagery Pack',
    category: 'Images',
    description: 'High-resolution 4K aerial captures (50k frames) with semantic labels: roads, buildings, vegetation, water.',
    size: '62 GB',
    price: 200,
    uploader: VALID_OWNER,
    uploads: VALID_OWNER,
    downloads: 56,
    earnings: 11200,
    timestamp: Date.now() - 86400000 * 15,
  },
];

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState(() => {
    try {
      const stored = localStorage.getItem('datashel_datasets');
      return stored ? [...SEED_DATASETS, ...JSON.parse(stored)] : SEED_DATASETS;
    } catch {
      return SEED_DATASETS;
    }
  });

  const addDataset = (dataset) => {
    const newDs = { ...dataset, id: Date.now().toString(), downloads: 0, earnings: 0, timestamp: Date.now() };
    setDatasets(prev => {
      const updated = [newDs, ...prev];
      const userDs = updated.filter(d => !SEED_DATASETS.find(s => s.id === d.id));
      localStorage.setItem('datashel_datasets', JSON.stringify(userDs));
      return updated;
    });
    return newDs;
  };

  const updateDataset = (id, changes) => {
    setDatasets(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...changes } : d);
      const userDs = updated.filter(d => !SEED_DATASETS.find(s => s.id === d.id));
      localStorage.setItem('datashel_datasets', JSON.stringify(userDs));
      return updated;
    });
  };

  const recordDownload = (id) => {
    setDatasets(prev => prev.map(d =>
      d.id === id ? { ...d, downloads: d.downloads + 1, earnings: d.earnings + d.price } : d
    ));
  };

  const totalStats = {
    listed: datasets.length,
    downloads: datasets.reduce((s, d) => s + d.downloads, 0),
  };

  return (
    <DataContext.Provider value={{ datasets, addDataset, updateDataset, recordDownload, totalStats }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

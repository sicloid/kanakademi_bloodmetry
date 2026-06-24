import { useState, useEffect, useRef } from 'react';

export interface Pledge {
  id: number;
  donorName: string;
  bloodType: string;
  location: string;
  timestamp: number;
  units: number;
}

const INITIAL_GLOBAL = 142854;
const INITIAL_TURKEY = 8452;

const INITIAL_PLEDGES: Pledge[] = [
  { id: -1, donorName: "Marcus Vance", bloodType: "O-", location: "St. Jude Clinic", timestamp: Date.now() - 15000, units: 1 },
  { id: -2, donorName: "Anya Petrova", bloodType: "AB+", location: "Metro Red Cross", timestamp: Date.now() - 85000, units: 1 },
  { id: -3, donorName: "Kenji Sato", bloodType: "A-", location: "Shibuya Medical", timestamp: Date.now() - 240000, units: 1 },
  { id: -4, donorName: "Elena Rostova", bloodType: "B+", location: "Berlin Central Bank", timestamp: Date.now() - 480000, units: 1 }
];

export function usePulseData() {
  const [globalDonations, setGlobalDonations] = useState(INITIAL_GLOBAL);
  const [turkeyDonations, setTurkeyDonations] = useState(INITIAL_TURKEY);
  const [pledges, setPledges] = useState<Pledge[]>(INITIAL_PLEDGES);
  const isSimulationRef = useRef(false);

  // Connection to WebSocket or Simulation Fallback
  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: number | null = null;
    let fallbackLoopCount = 0;

    const startSimulation = () => {
      isSimulationRef.current = true;
      fallbackInterval = window.setInterval(() => {
        const increment = Math.floor(Math.random() * 3) + 3; // 3 to 5
        setGlobalDonations(prev => prev + increment);
        
        fallbackLoopCount++;
        if (fallbackLoopCount % 7 === 0) {
          setTurkeyDonations(prev => prev + 1);
        }
      }, 1500);
    };

    try {
      ws = new WebSocket("ws://188.132.232.104:8081/ws");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.Total) setGlobalDonations(data.Total);
          if (data.TotalTurkey) setTurkeyDonations(data.TotalTurkey);
        } catch (e) {
          console.error("Failed to parse WS data", e);
        }
      };

      ws.onerror = () => {
        if (!isSimulationRef.current) startSimulation();
      };
      
      ws.onclose = () => {
        if (!isSimulationRef.current) startSimulation();
      };
    } catch (error) {
      if (!isSimulationRef.current) startSimulation();
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) window.clearInterval(fallbackInterval);
    };
  }, []);

  const addPledge = (pledge: Omit<Pledge, 'id' | 'timestamp' | 'units'>) => {
    const newPledge: Pledge = {
      ...pledge,
      id: Date.now(),
      timestamp: Date.now(),
      units: 1
    };
    setPledges(prev => [newPledge, ...prev]);
    setGlobalDonations(prev => prev + 1);
    setTurkeyDonations(prev => prev + 1);
  };

  const clearPledges = () => {
    setPledges([]);
  };

  return {
    globalDonations,
    globalLivesSaved: globalDonations * 3,
    turkeyDonations,
    turkeyLivesSaved: turkeyDonations * 3,
    pledges,
    addPledge,
    clearPledges
  };
}

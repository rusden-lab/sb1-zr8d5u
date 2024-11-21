import { useState, useEffect } from 'react';
import { VPNRouter } from './components/VPNRouter';
import { NeuralPacket } from './types/neural';
import { MelbourneSimulator } from './utils/simulator';

export default function App() {
  const [receivedPackets, setReceivedPackets] = useState<NeuralPacket[]>([]);
  const [isAutoRunning, setIsAutoRunning] = useState(true);
  const [activeLocation, setActiveLocation] = useState<'melbourne' | 'toorak'>('melbourne');

  const handleTransmit = (packet: NeuralPacket) => {
    setReceivedPackets(prev => [packet, ...prev].slice(0, 10));
  };

  useEffect(() => {
    if (!isAutoRunning) return;

    const interval = setInterval(() => {
      const packet = MelbourneSimulator.generatePacket(activeLocation);
      const event = new CustomEvent('neural-packet', { detail: packet });
      window.dispatchEvent(event);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRunning, activeLocation]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Victoria Neural VPN Network</h1>
          <div className="flex items-center gap-4">
            <select
              value={activeLocation}
              onChange={(e) => setActiveLocation(e.target.value as 'melbourne' | 'toorak')}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              <option value="melbourne">Melbourne CBD</option>
              <option value="toorak">Toorak</option>
            </select>
            <span className="text-white">Auto-transmission:</span>
            <button
              onClick={() => setIsAutoRunning(!isAutoRunning)}
              className={`px-4 py-2 rounded ${
                isAutoRunning ? 'bg-green-600' : 'bg-red-600'
              } text-white`}
            >
              {isAutoRunning ? 'Active' : 'Paused'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <VPNRouter onRoute={handleTransmit} location={activeLocation} />
          
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Secured Transmissions</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {receivedPackets.map(packet => (
                <div key={packet.id} 
                     className={`p-2 rounded text-white text-sm ${
                       packet.priority === 'justice' ? 'bg-purple-900' :
                       packet.priority === 'law-enforcement' ? 'bg-blue-900' :
                       'bg-gray-700'
                     }`}>
                  <div>From: {packet.source}</div>
                  <div>To: {packet.destination}</div>
                  <div>Priority: {packet.priority}</div>
                  <div>Classification: {packet.classification}</div>
                  <div>Data: {packet.data}</div>
                  <div>Jurisdiction: {packet.jurisdiction}</div>
                  <div className="text-xs text-gray-400">
                    Timestamp: {new Date(packet.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
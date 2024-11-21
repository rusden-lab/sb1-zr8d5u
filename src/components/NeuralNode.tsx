import { useState } from 'react';
import { NeuralPacket } from '../types/neural';

interface NeuralNodeProps {
  id: string;
  name: string;
  onTransmit: (packet: NeuralPacket) => void;
}

export const NeuralNode: React.FC<NeuralNodeProps> = ({ id, name, onTransmit }) => {
  const [message, setMessage] = useState('');
  const [destination, setDestination] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  const handleTransmit = () => {
    if (!message || !destination) return;

    const packet: NeuralPacket = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data: message,
      source: id,
      destination,
      jurisdiction: jurisdiction || undefined
    };

    const event = new CustomEvent('neural-packet', { detail: packet });
    window.dispatchEvent(event);

    onTransmit(packet);
    setMessage('');
    setJurisdiction('');
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${
      id.includes('justice') ? 'bg-purple-900' :
      id.includes('law') ? 'bg-blue-900' :
      'bg-gray-800'
    }`}>
      <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Neural data..."
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination ID..."
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <select
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select Jurisdiction</option>
          <option value="federal">Federal</option>
          <option value="state">State</option>
          <option value="local">Local</option>
          <option value="international">International</option>
        </select>
        <button
          onClick={handleTransmit}
          disabled={!message || !destination}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Secure Transmit
        </button>
      </div>
    </div>
  );
};
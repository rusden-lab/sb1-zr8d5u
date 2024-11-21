import { useState, useEffect } from 'react';
import { NeuralPacket } from '../types/neural';
import { NeuralEncryption } from '../utils/encryption';

interface VPNRouterProps {
  onRoute: (packet: NeuralPacket) => void;
  location: 'melbourne' | 'toorak';
}

export const VPNRouter: React.FC<VPNRouterProps> = ({ onRoute, location }) => {
  const [packets, setPackets] = useState<NeuralPacket[]>([]);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    lawEnforcement: 0,
    justice: 0,
    standard: 0
  });

  useEffect(() => {
    const eventHandler = (event: CustomEvent<NeuralPacket>) => {
      processPacket(event.detail);
    };

    window.addEventListener('neural-packet' as any, eventHandler);
    return () => window.removeEventListener('neural-packet' as any, eventHandler);
  }, []);

  const processPacket = (packet: NeuralPacket) => {
    const priority = determinePacketPriority(packet);
    const encryptedData = NeuralEncryption.encrypt(packet.data, priority);
    const anonymizedSource = NeuralEncryption.anonymize(packet.source, priority);
    
    const processedPacket: NeuralPacket = {
      ...packet,
      source: anonymizedSource,
      encryptedData,
      data: '[ENCRYPTED]',
      priority,
      classification: determineClassification(packet)
    };

    setPackets(prev => [processedPacket, ...prev].slice(0, 5));
    setStats(prev => ({
      totalProcessed: prev.totalProcessed + 1,
      lawEnforcement: prev.lawEnforcement + (priority === 'law-enforcement' ? 1 : 0),
      justice: prev.justice + (priority === 'justice' ? 1 : 0),
      standard: prev.standard + (priority === 'standard' ? 1 : 0)
    }));
    
    const routingDelay = getRoutingDelay(priority);
    setTimeout(() => {
      onRoute({
        ...processedPacket,
        data: NeuralEncryption.decrypt(encryptedData, priority)
      });
    }, routingDelay);
  };

  const determinePacketPriority = (packet: NeuralPacket): 'standard' | 'justice' | 'law-enforcement' => {
    if (packet.source.includes('Court')) return 'justice';
    if (packet.source.includes('Police')) return 'law-enforcement';
    return 'standard';
  };

  const determineClassification = (packet: NeuralPacket): 'public' | 'confidential' | 'restricted' => {
    if (packet.priority === 'law-enforcement') return 'restricted';
    if (packet.priority === 'justice') return 'confidential';
    return 'public';
  };

  const getRoutingDelay = (priority: string): number => {
    switch (priority) {
      case 'law-enforcement':
        return 500;
      case 'justice':
        return 750;
      default:
        return 1000;
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">
        {location === 'melbourne' ? 'Melbourne' : 'Toorak'} VPN Router
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-white">Total Processed</div>
          <div className="text-2xl font-bold text-blue-400">{stats.totalProcessed}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <div className="text-white">Active Routes</div>
          <div className="text-2xl font-bold text-green-400">{packets.length}</div>
        </div>
      </div>

      <div className="space-y-2">
        {packets.map(packet => (
          <div key={packet.id} 
               className={`p-2 rounded text-white text-sm ${
                 packet.priority === 'justice' ? 'bg-purple-900' :
                 packet.priority === 'law-enforcement' ? 'bg-blue-900' :
                 'bg-gray-800'
               }`}>
            <div>From: {packet.source}</div>
            <div>To: {packet.destination}</div>
            <div>Priority: {packet.priority}</div>
            <div>Classification: {packet.classification}</div>
            <div>Data: {packet.data}</div>
            <div className="text-xs text-gray-400">Status: Secure Routing...</div>
          </div>
        ))}
      </div>
    </div>
  );
};
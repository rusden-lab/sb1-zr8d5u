export interface NeuralPacket {
  id: string;
  timestamp: number;
  data: string;
  source: string;
  destination: string;
  encryptedData?: string;
  priority?: 'standard' | 'justice' | 'law-enforcement';
  classification?: 'public' | 'confidential' | 'restricted';
  jurisdiction?: string;
}
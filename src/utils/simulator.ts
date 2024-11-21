import { NeuralPacket } from '../types/neural';

export class MelbourneSimulator {
  private static readonly MELBOURNE_LOCATIONS = [
    'Melbourne CBD',
    'Carlton Courts',
    'Victoria Police HQ',
    'St Kilda Road Police Complex',
    'Melbourne Magistrates Court',
    'Victorian County Court'
  ];

  private static readonly TOORAK_LOCATIONS = [
    'Toorak Police Station',
    'Toorak Village',
    'Hawksburn Station',
    'Toorak Road Precinct',
    'South Yarra District Court',
    'Prahran Police Complex'
  ];

  private static readonly SAMPLE_MESSAGES = [
    'Case update notification',
    'Incident report filed',
    'Court schedule change',
    'Status update required',
    'Document verification request',
    'Emergency alert broadcast'
  ];

  static generatePacket(location: 'melbourne' | 'toorak' = 'melbourne'): NeuralPacket {
    const locations = location === 'melbourne' ? 
      this.MELBOURNE_LOCATIONS : 
      this.TOORAK_LOCATIONS;

    const source = locations[Math.floor(Math.random() * locations.length)];
    let destination;
    do {
      destination = locations[Math.floor(Math.random() * locations.length)];
    } while (destination === source);

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data: this.SAMPLE_MESSAGES[Math.floor(Math.random() * this.SAMPLE_MESSAGES.length)],
      source,
      destination,
      jurisdiction: location === 'melbourne' ? 'Melbourne CBD' : 'Toorak',
      priority: this.determinePriority(source)
    };
  }

  private static determinePriority(source: string): 'standard' | 'justice' | 'law-enforcement' {
    if (source.includes('Court')) return 'justice';
    if (source.includes('Police')) return 'law-enforcement';
    return 'standard';
  }
}
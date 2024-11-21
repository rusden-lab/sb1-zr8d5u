import CryptoJS from 'crypto-js';

export class NeuralEncryption {
  private static readonly KEY = 'neural-vpn-key';
  private static readonly JUSTICE_KEY = 'justice-system-key';
  private static readonly LAW_ENFORCEMENT_KEY = 'law-enforcement-key';
  
  static encrypt(data: string, priority?: string): string {
    const encryptionKey = this.getEncryptionKey(priority);
    const timestamp = Date.now().toString();
    const dataWithTimestamp = `${data}|${timestamp}`;
    return CryptoJS.AES.encrypt(dataWithTimestamp, encryptionKey).toString();
  }
  
  static decrypt(encryptedData: string, priority?: string): string {
    const decryptionKey = this.getEncryptionKey(priority);
    const bytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const [data] = decryptedData.split('|');
    return data;
  }
  
  static anonymize(sourceId: string, priority?: string): string {
    const salt = priority || 'standard';
    return CryptoJS.SHA256(`${sourceId}${salt}`).toString().substring(0, 12);
  }

  private static getEncryptionKey(priority?: string): string {
    switch (priority) {
      case 'justice':
        return this.JUSTICE_KEY;
      case 'law-enforcement':
        return this.LAW_ENFORCEMENT_KEY;
      default:
        return this.KEY;
    }
  }

  static validateJurisdiction(jurisdiction: string): boolean {
    const validJurisdictions = ['federal', 'state', 'local', 'international'];
    return validJurisdictions.includes(jurisdiction.toLowerCase());
  }
}
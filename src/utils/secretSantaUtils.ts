import { Participant, Pairing } from '../models/types';

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T> (array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateSecretSantaPairings = (participants: Participant[]): Pairing[] | null => {
  if (participants.length < 2) {
    return null;
  }

  // Try to generate pairings up to 100 times
  for (let attempt = 0; attempt < 100; attempt++) {
    const pairings: Pairing[] = [];
    const receivers = shuffleArray([...participants]);
    const givers = [...participants];
    let validPairings = true;

    for (const giver of givers) {
      // Find a valid receiver for this giver
      const validReceivers = receivers.filter(receiver =>
        receiver.id !== giver.id &&
        (!giver.exclusions || !giver.exclusions.includes(receiver.id))
      );

      if (validReceivers.length === 0) {
        validPairings = false;
        break;
      }

      // Get first valid receiver
      const receiver = validReceivers[0];
      pairings.push({ giver, receiver });

      // Remove this receiver from available receivers
      const index = receivers.findIndex(r => r.id === receiver.id);
      if (index !== -1) {
        receivers.splice(index, 1);
      }
    }

    if (validPairings) {
      return pairings;
    }
  }

  // If we couldn't generate valid pairings after multiple attempts
  return null;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

const encodeUrl = (url: string): string => {
  // Handle Unicode characters by encoding to UTF-8 first
  const encoded = encodeURIComponent(url)
    .replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));

  return btoa(encoded)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const decodeUrl = (encoded: string): string => {
  const padding = '='.repeat((4 - encoded.length % 4) % 4);
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/') + padding;

  // Decode base64 and handle Unicode characters
  const binaryString = atob(base64);
  const utf8String = binaryString
    .split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('');

  return decodeURIComponent(utf8String);
}

// Encode pairings to a URL-safe format
export const encodePairings = (pairings: Pairing[]): string => {
  const pairs = pairings.map(pair => [pair.giver.name, pair.receiver.name]);
  const minifiedJson = JSON.stringify(pairs);
  return encodeUrl(minifiedJson);
};

// Decode pairings from a URL-safe format
export const decodePairings = (encoded: string): Pairing[] | null => {
  try {
    const json = decodeUrl(encoded);
    if (!json) return null;

    const decodedPairings = JSON.parse(json);
    if (decodedPairings) {
      const decodedPairingsArray = Array.isArray(decodedPairings)
        ? decodedPairings
        : [decodedPairings];
      const newPairings = decodedPairingsArray.map((pairing) => ({
        giver: {
          id: generateId(),
          name: pairing[0]
        },
        receiver: {
          id: generateId(),
          name: pairing[1]
        }
      }));
      return newPairings;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode pairings:', error);
    return null;
  }
};

// Sanitize CSV field to prevent injection and handle special characters
const sanitizeCSVField = (field: string): string => {
  // Prevent CSV injection by prefixing formulas with single quote
  if (/^[=+\-@]/.test(field)) {
    field = "'" + field;
  }
  
  // Escape quotes and wrap in quotes if field contains special characters
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    field = '"' + field.replace(/"/g, '""') + '"';
  }
  
  return field;
};

// Export pairings to CSV (without revealing who gives to whom)
export const exportPairingsToCSV = (pairings: Pairing[]): void => {
  // Create CSV content with just the receiver names to maintain secrecy
  // We don't include giver information to keep the secret santa anonymous
  const headers = ['Recipient'];
  const rows = pairings.map(pairing => [sanitizeCSVField(pairing.receiver.name)]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `secret-santa-pairings-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

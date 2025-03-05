import { Participant, Pairing } from '../models/types';

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T> (array: T[]): T[] => {
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

// Create a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Encode pairings to a URL-safe format
export const encodePairings = (pairings: Pairing[]): string => {
  const simplified = pairings.map(pair => ({
    giver: {
      id: pair.giver.id,
      name: pair.giver.name,
      email: pair.giver.email || ''
    },
    receiver: {
      id: pair.receiver.id,
      name: pair.receiver.name,
      email: pair.receiver.email || ''
    }
  }));

  return btoa(encodeURIComponent(JSON.stringify(simplified)));
};

// Decode pairings from a URL-safe format
export const decodePairings = (encoded: string): Pairing[] | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decode pairings:', error);
    return null;
  }
};

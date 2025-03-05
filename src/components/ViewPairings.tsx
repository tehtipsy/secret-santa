import React, { useState } from 'react';
import { Pairing } from '../models/types';

interface ViewPairingsProps {
  pairings: Pairing[] | null;
  onRegeneratePairings: () => void;
}

const ViewPairings: React.FC<ViewPairingsProps> = ({ pairings, onRegeneratePairings }) => {
  const [visiblePairings, setVisiblePairings] = useState<string[]>([]);

  const togglePairingVisibility = (id: string) => {
    if (visiblePairings.includes(id)) {
      setVisiblePairings(visiblePairings.filter((pairingId) => pairingId !== id));
    } else {
      setVisiblePairings([...visiblePairings, id]);
    }
  };

  if (!pairings) {
    return null;
  }

  return (
    <div className="view-pairings">
      <h2>Secret Santa Pairings</h2>
      <button onClick={onRegeneratePairings}>Regenerate Pairings</button>
      
      <div style={{ marginTop: '1rem' }}>
        {pairings.map((pairing) => (
          <div key={pairing.giver.id} className="pairing-card">
            <div>
              <strong>{pairing.giver.name}</strong> gives a gift to:{' '}
              {visiblePairings.includes(pairing.giver.id) ? (
                <strong>{pairing.receiver.name}</strong>
              ) : (
                <em>Click to reveal</em>
              )}
            </div>
            <button
              onClick={() => togglePairingVisibility(pairing.giver.id)}
              className="button-secondary"
            >
              {visiblePairings.includes(pairing.giver.id) ? 'Hide' : 'Reveal'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPairings;
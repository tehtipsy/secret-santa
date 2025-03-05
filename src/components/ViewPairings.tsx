import React, { useState } from 'react';
import { Pairing } from '../models/types';
import { encodePairings } from '../utils/secretSantaUtils';

interface ViewPairingsProps {
  pairings: Pairing[];
  onRegeneratePairings?: () => void;
  readonly?: boolean;
}

const ViewPairings: React.FC<ViewPairingsProps> = ({
  pairings,
  onRegeneratePairings,
  readonly = false
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPairingIndex, setSelectedPairingIndex] = useState<number | null>(null);

  const handleShareLink = () => {
    const encoded = encodePairings(pairings);

    // More robust URL construction for GitHub Pages
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/\/index\.html$/, '');

    // For GitHub Pages with HashRouter, this is more reliable
    const shareUrl = `${origin}${pathname}#/shared/${encoded}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  const togglePairing = (index: number) => {
    setSelectedPairingIndex(selectedPairingIndex === index ? null : index);
  };

  return (
    <div className="pairings-container">
      <h2>Secret Santa Pairings</h2>
      
      {!readonly && (
        <div className="actions">
          <button onClick={handleShareLink}>
            {copiedLink ? "Link Copied!" : "Share These Pairings"}
          </button>
          {onRegeneratePairings && (
            <button onClick={onRegeneratePairings}>
              Regenerate Pairings
            </button>
          )}
        </div>
      )}

      <div className="pairings-list">
        {pairings.map((pairing, index) => (
          <div
            key={pairing.giver.id}
            className="pairing-card"
            onClick={() => togglePairing(index)}
          >
            <div className="giver">{pairing.giver.name}</div>
            <div className="arrow">→</div>
            <div className="receiver">
              {selectedPairingIndex === index
                ? pairing.receiver.name
                : "Click to reveal"
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPairings;
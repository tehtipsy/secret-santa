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
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [selectedPairingIndex, setSelectedPairingIndex] = useState<number | null>(null);

  const handleShareLink = (index: number) => {
    // Share a single pairing
    const pairingToShare = [pairings[index]];
    const encoded = encodePairings(pairingToShare);

    // More robust URL construction for GitHub Pages
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/\/index\.html$/, '');

    // For GitHub Pages with HashRouter, this is more reliable
    const shareUrl = `${origin}${pathname}#/shared/${encoded}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedLink(index);
        setTimeout(() => setCopiedLink(null), 2000);
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
      {!readonly && onRegeneratePairings && (
        <div className="actions">
          <button onClick={onRegeneratePairings}>
            Regenerate Pairings
          </button>
        </div>
      )}
      
      {!readonly && <h2>Secret Santa Pairings</h2>}
      {readonly && <h2>גלו מי יקבל את משלוח המנות שלכם</h2>}

      <div className="pairings-list">
        {pairings.map((pairing, index) => (
          <>
          <div
            key={pairing.giver.id}
            className="pairing-card"
          >
            <div className="pairing-info" onClick={() => togglePairing(index)}>
              <div className="giver">{pairing.giver.name}</div>
              <div className="arrow">↓</div>
              <div className="receiver">
                <button className="button-reveal">{
                  selectedPairingIndex === index
                  ? pairing.receiver.name
                  : "לחצו כדי לגלות"
                }</button>
              </div>
            </div>

            </div>
            {!readonly && (
              <div className="pairing-actions">
                <button onClick={() => handleShareLink(index)}>
                  {copiedLink === index ? "Link Copied!" : "Share This Pairing"}
                </button>
              </div>
            )}
          </>
          
        ))}
      </div>
    </div>
  );
};

export default ViewPairings;
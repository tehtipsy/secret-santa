import { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import ParticipantsList from './components/ParticipantsList';
import ViewPairings from './components/ViewPairings';
import { Participant, Pairing } from './models/types';
import { generateSecretSantaPairings } from './utils/secretSantaUtils';
import React from 'react';

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pairings, setPairings] = useState<Pairing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddParticipant = (participant: Participant) => {
    setParticipants([...participants, participant]);
    // Clear pairings when participants change
    setPairings(null);
    setError(null);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    // Clear pairings when participants change
    setPairings(null);
    setError(null);
    
    // Also remove this participant from any exclusion lists
    setParticipants(prevParticipants => 
      prevParticipants.map(p => ({
        ...p,
        exclusions: (p.exclusions || []).filter(exId => exId !== id)
      }))
    );
  };

  const handleUpdateExclusions = (id: string, exclusions: string[]) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, exclusions } : p))
    );
    // Clear pairings when exclusions change
    setPairings(null);
    setError(null);
  };

  const handleGeneratePairings = () => {
    const newPairings = generateSecretSantaPairings(participants);
    
    if (newPairings) {
      setPairings(newPairings);
      setError(null);
    } else {
      setError("Couldn't generate valid pairings. Try removing some exclusions.");
      setPairings(null);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <ParticipantsList
        participants={participants}
        onAddParticipant={handleAddParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        onUpdateExclusions={handleUpdateExclusions}
      />
      
      {participants.length >= 2 && (
        <div>
          <button onClick={handleGeneratePairings} disabled={participants.length < 2}>
            Generate Secret Santa Pairings
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {pairings && (
        <ViewPairings
          pairings={pairings}
          onRegeneratePairings={handleGeneratePairings}
        />
      )}
    </div>
  );
}

export default App;
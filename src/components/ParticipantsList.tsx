import React, { useState } from 'react';
import { Participant } from '../models/types';
import { generateId } from '../utils/secretSantaUtils';

interface ParticipantsListProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
  onUpdateExclusions: (id: string, exclusions: string[]) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateExclusions,
}) => {
  const [newNames, setNewNames] = useState('');
  const [showExclusions, setShowExclusions] = useState<string | null>(null);

  const handleAddParticipant = () => {
    if (newNames.trim()) {
      const names = newNames
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');

      // Add each participant one by one to ensure they all get added
      for (const name of names) {
        const newParticipant = {
          id: generateId(),
          name,
          exclusions: [],
        };
        onAddParticipant(newParticipant);
      }

      setNewNames('');
    }
  };

  const toggleExclusions = (id: string) => {
    setShowExclusions(showExclusions === id ? null : id);
  };

  const handleExclusionToggle = (participantId: string, exclusionId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;

    const exclusions = participant.exclusions || [];
    const newExclusions = exclusions.includes(exclusionId)
      ? exclusions.filter(id => id !== exclusionId)
      : [...exclusions, exclusionId];

    onUpdateExclusions(participantId, newExclusions);
  };

  return (
    <div className="participants-list">
      <h2>Participants</h2>
      
      <div className="participant-item">
        <textarea
          value={newNames}
          onChange={(e) => setNewNames(e.target.value)}
          placeholder="Enter participant names (one per line)"
          rows={4}
          style={{ width: '100%', marginBottom: '10px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              handleAddParticipant();
            }
          }}
        />
        <button onClick={handleAddParticipant}>Add Participants</button>
      </div>
      
      {participants.length > 0 ? (
        <div>
          {participants.map((participant) => (
            <div key={participant.id}>
              <div className="participant-item">
                <span>{participant.name}</span>
                <button 
                  className="button-secondary" 
                  onClick={() => toggleExclusions(participant.id)}
                >
                  {showExclusions === participant.id ? 'Hide Exclusions' : 'Set Exclusions'}
                </button>
                <button 
                  className="button-secondary" 
                  onClick={() => onRemoveParticipant(participant.id)}
                >
                  Remove
                </button>
              </div>
              
              {showExclusions === participant.id && (
                <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <p>Select who {participant.name} cannot be paired with:</p>
                  {participants
                    .filter(p => p.id !== participant.id)
                    .map(p => (
                      <label key={p.id} style={{ display: 'block', margin: '5px 0' }}>
                        <input
                          type="checkbox"
                          checked={(participant.exclusions || []).includes(p.id)}
                          onChange={() => handleExclusionToggle(participant.id, p.id)}
                        />
                        {' '}{p.name}
                      </label>
                    ))
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No participants added yet.</p>
      )}
    </div>
  );
};

export default ParticipantsList;
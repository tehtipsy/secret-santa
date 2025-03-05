import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { decodePairings } from '../utils/secretSantaUtils';
import { Pairing } from '../models/types';
import ViewPairings from './ViewPairings';

const SharedPairings: React.FC = () => {
  const { encodedData } = useParams();
  const [pairings, setPairings] = useState<Pairing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!encodedData) {
      setError('No pairings data found in URL');
      return;
    }

    const decodedPairings = decodePairings(encodedData);
    if (decodedPairings) {
      setPairings(decodedPairings);
    } else {
      setError('Failed to decode pairings from URL');
    }
  }, [encodedData]);

  if (error) {
    return (
      <div className="shared-pairings error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/">Return to home</Link>
      </div>
    );
  }

  if (!pairings) {
    return <div className="shared-pairings loading">Loading pairings...</div>;
  }

  return (
    <div className="shared-pairings">
      <h2>Secret Santa Pairings</h2>
      <p>These pairings were shared with you!</p>
      <ViewPairings pairings={pairings} readonly />
      <Link to="/">Create your own Secret Santa</Link>
    </div>
  );
};

export default SharedPairings;

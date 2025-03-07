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
      <h2>משלוח מנות פורים משפחתי 2025</h2>
      <h3>חיכינו לזה שנה שלמה 🥳</h3>
      <h3>והשנה הקונספט… עתידני !</h3>
      <h3>👽👾🛸🤖🔫🪐☄️🔭🚀</h3>
      <p>לחצו על הכפתור בתחתית המסך כדי לחשוף מי יקבל את משלוח המנות המושקע שלכם</p>
      <p>שימו לב - המשלוח יכול להכיל מכל טוב ולא רק מאכלים</p>
      <p>הכינו משלוח בתקציב עד 50₪</p>
      <p>נפגשים ביום שבת 15.3 בשעה 16:00</p>
      <ViewPairings pairings={pairings} readonly />
      <Link to="/">לחצו כאן כדי ליצור הגרלת זוגות חדשה</Link>
    </div>
  );
};

export default SharedPairings;

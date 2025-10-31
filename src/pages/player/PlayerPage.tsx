import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UnyFilmPlayer from '../../components/player/UnyFilmPlayer';
import type { MovieData } from '../../types';

export default function PlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieData | null>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stateMovie = (location.state as any)?.movie as MovieData | undefined;
    if (stateMovie) {
      setMovie(stateMovie);
      localStorage.setItem('unyfilm:currentMovie', JSON.stringify(stateMovie));
      return;
    }

    const saved = localStorage.getItem('unyfilm:currentMovie');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MovieData;
        setMovie(parsed);
        return;
      } catch {
        // ignore
      }
    }

    navigate('/home', { replace: true });
  }, [location.state, navigate]);

  const handleClose = (): void => {
    navigate(-1);
  };

  if (!movie) return null;

  return (
    <div className="player-page-root" style={{ minHeight: '100vh', backgroundColor: '#0b1220' }}>
      <UnyFilmPlayer movie={movie} onClose={handleClose} />
    </div>
  );
}

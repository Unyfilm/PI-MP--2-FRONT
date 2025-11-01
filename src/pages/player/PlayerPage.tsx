/**
 * @file PlayerPage.tsx
 * @description Page component that manages the movie playback experience.
 * It loads movie data from React Router state or localStorage, initializes
 * the `UnyFilmPlayer` component, and handles navigation logic for closing
 * or missing movie context.
 *
 * This component ensures smooth continuity between navigation and reloads
 * by persisting the currently playing movie locally.
 *
 * @module Pages/PlayerPage
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UnyFilmPlayer from '../../components/player/UnyFilmPlayer';
import type { MovieData } from '../../types';


/**
 * PlayerPage
 *
 * React page responsible for rendering the movie player interface.
 * It retrieves the selected movie from navigation state or localStorage
 * and ensures the movie data persists across reloads.
 *
 * If no movie is found, it safely redirects the user back to `/home`.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/player" element={<PlayerPage />} />
 * ```
 *
 * @returns {JSX.Element | null} A full-screen movie player component or `null` if loading.
 */
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

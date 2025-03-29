import { useEffect } from 'react';
import Game from '../components/GameComponent';

const Home = () => {
    // Preventing the default scrolling behavior
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="home">
      <h1 className="page-title">This is the home page.</h1>
      <Game />
    </div>
  );
};

export default Home;

import { useEffect } from 'react';
import Game from '../components/GameComponent';
// import Footer from '../components/Footer';
// import LoginModal from '../components/LoginModal';
// import MenuBox from '../components/MenuBox';
//import '../styles/home.css'

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
      <Game />
    </div>
  );
};

export default Home;

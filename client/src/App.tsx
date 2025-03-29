import './styles/App.css';
import { Outlet } from 'react-router-dom';

// import Footer from './components/Footer';


function App() {
  return (
    <div className="flex-column justify-flex-start min-100-vh">
      <div className="container">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;

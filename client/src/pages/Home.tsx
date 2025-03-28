// import { NavLink } from "react-router-dom";
// import "..style.css"

import Game from '../components/GameComponent';

const Home = () => {
    return (
        <div className="home">
            <h1 className="page-title">This is the home page.</h1>
            <Game />
        </div>
    )
};

export default Home;
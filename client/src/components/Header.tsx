import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import LoginModal from "./LoginModal";

const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="header">
            <NavLink to="/">Home</NavLink>
            <button onClick={() => setIsModalOpen(true)} className="login-button">
                Login
            </button>

            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
};

export default Header;
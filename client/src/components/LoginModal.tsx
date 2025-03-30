import React, { useEffect, useState } from 'react';
import { mockUsers } from '../assets/tempWords/user';
import '../styles/loginModal.css'

interface LoginModalProps {
  showModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: React.FC<LoginModalProps> = ({ showModal, setShowLoginModal, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLoginModal(false);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLoginModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [setShowLoginModal]);

  const toggleLoginSignUp = () => {
    setIsLogin((prev) => !prev);
    setUsername('');
    setPassword('');
  };

  const handleLogin = () => {
    const user = mockUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setLocalIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
      setLocalIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLocalIsLoggedIn(false);
    setShowLoginModal(false);
  };

  const handleSignUp = () => {
    // Check if the username already exists
    const userExists = mockUsers.some((user) => user.username === username);
    if (userExists) {
      alert('Username already exists');
      return;
    }

    // Add the new user to mockUsers (temporarily for testing)
    mockUsers.push({ id: mockUsers.length + 1, username, password });
    alert('Sign-up successful');
    setIsLogin(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    showModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <button className="close-btn" onClick={handleClose}>X</button>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            <label className="modal-input">
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="modal-input">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button onClick={toggleLoginSignUp}>
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
          </button>

          {isLoggedIn ? (
            <div>
              <p>You're signed in, {username}!</p>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          ) : null}
        </div>
      </div>
    )
  );
};

export default LoginModal;

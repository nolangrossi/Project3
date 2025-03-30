import React, { useState } from 'react';
import { mockUsers } from '../assets/tempWords/user';

interface LoginModalProps {
  showModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: React.FC<LoginModalProps> = ({ showModal, setShowLoginModal, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true); // Tracks if in login or sign-up tab
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);

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
      setIsLoggedIn(true); // Update the parent state to logged in
      setLocalIsLoggedIn(true); // Local state for modal logic
    } else {
      alert('Invalid credentials');
      setLocalIsLoggedIn(false);  // Ensure isLoggedIn remains false for failed login
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update the parent state to logged out
    setLocalIsLoggedIn(false); // Local state for modal logic
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
    setIsLogin(true); // Switch back to login after successful sign-up
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp(); // Sign-up logic when not in login mode
    }
  };

  return (
    showModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
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

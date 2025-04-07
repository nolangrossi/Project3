import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, SIGNUP_USER } from '../../utils/mutations';
import '../../styles/loginModal.css';

interface LoginModalProps {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: React.FC<LoginModalProps> = ({ showLoginModal, setShowLoginModal, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

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

    const stopArrowKeys = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    if (showLoginModal) {
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', stopArrowKeys);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', stopArrowKeys);
    };
  }, [showLoginModal, setShowLoginModal]);

  const toggleLoginSignUp = () => {
    setIsLogin((prev) => !prev);
    setUsername('');
    setEmail('');
    setPassword('');
    setErrorMessage(null); // Clear error message when switching modes
  };

  const [loginMutation] = useMutation(LOGIN_USER);
  const [signUpMutation] = useMutation(SIGNUP_USER);

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data?.loginUser?.token) {
        localStorage.setItem('token', data.loginUser.token);
        localStorage.setItem('username', data.loginUser.user.username);
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setLocalIsLoggedIn(true);
        setUsername(data.loginUser.user.username);
        setErrorMessage(null); // Clear error message on success
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.'); // Set error message
      console.error(error);
    }
  };

  const handleSignUp = async () => {
    try {
      const { data } = await signUpMutation({ variables: { username, email, password } });
      if (data.registerUser.token) {
        localStorage.setItem('token', data.registerUser.token);
        localStorage.setItem('username', data.registerUser.user.username);
        setIsLoggedIn(true);
        setLocalIsLoggedIn(true);
        setUsername(data.registerUser.user.username);
        setErrorMessage(null); // Clear error message on success
      }
    } catch (error: any) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const errorMessageFromServer = error.graphQLErrors[0].message;
        if (errorMessageFromServer.includes("email already in use")) {
          setErrorMessage("The email is already in use. Please try a different one.");
        } else {
          setErrorMessage(errorMessageFromServer || "Sign-up failed. Please try again.");
        }
      } else {
        setErrorMessage("Sign-up failed. Please try again."); // Generic error message
      }
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    setLocalIsLoggedIn(false);
    setUsername('');
    setShowLoginModal(false);
    window.location.reload();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedToken && storedUsername && storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
      setLocalIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setLocalIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn'); // Remove if not actually logged in
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    showLoginModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <button className="close-btn" onClick={handleClose}>X</button>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="modal-input">
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            )}
            <label className="modal-input">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginModal from '../components/LoginModal';

describe('LoginModal Component', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {}); // Prevents actual alert pop-ups
  });

  it('should allow signing up and fail login with wrong password', () => {
    const setShowLoginModal = vi.fn();
    const setIsLoggedIn = vi.fn();

    render(
      <LoginModal
        showModal={true}
        setShowLoginModal={setShowLoginModal}
        setIsLoggedIn={setIsLoggedIn}
      />
    );

    // Switch to sign-up mode
    fireEvent.click(screen.getByRole('button', { name: /switch to sign up/i }));

    // Fill out the sign-up form
    fireEvent.change(screen.getByLabelText(/username:/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: 'password123' } });

    // Submit sign-up form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Switch to login mode
    fireEvent.click(screen.getByRole('button', { name: /switch to login/i }));

    // Attempt login with wrong password
    fireEvent.change(screen.getByLabelText(/username:/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect an alert for invalid credentials
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should allow login with correct credentials and show logout option', () => {
    const setShowLoginModal = vi.fn();
    const setIsLoggedIn = vi.fn();

    render(
      <LoginModal
        showModal={true}
        setShowLoginModal={setShowLoginModal}
        setIsLoggedIn={setIsLoggedIn}
      />
    );

    // Fill out the login form
    fireEvent.change(screen.getByLabelText(/username:/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: 'password123' } });

    // Submit login form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Expect to see a logout button or signed-in message
    expect(screen.getByText(/you're signed in, testuser!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });
});

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reset-password/${uid}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password has been reset successfully.");
        setTimeout(() => navigate('/'), 3000); // Redirect to login
      } else {
        setError(data.detail || "An error occurred.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Set New Password</h2>
      {message && <div className="flash-message success">{message}</div>}
      {error && <div className="flash-message error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;

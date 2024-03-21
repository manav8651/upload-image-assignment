import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = response.data;
      if (response.status === 200) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        // Handle successful login here (e.g., redirect, store token, etc.)
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ margin: 'auto', width: '300px', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label><br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white' }}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

const TwoFactorAuth = ({ userId }) => {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const generate2FA = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/2fa/generate', { userId });
      setQrCode(response.data.qrCodeDataURL);
      setSecret(response.data.secret);
      setError(null);
    } catch (err) {
      setError('Failed to generate 2FA secret');
    }
  };

  const verify2FA = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/2fa/verify', { userId, token });
      if (response.data.verified) {
        setVerified(true);
        setError(null);
      } else {
        setError('Invalid token');
      }
    } catch (err) {
      setError('Verification failed');
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      {!qrCode && (
        <button
          onClick={generate2FA}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Setup Two-Factor Authentication
        </button>
      )}
      {qrCode && !verified && (
        <>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" className="my-4" />
          <input
            type="text"
            placeholder="Enter authentication code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={verify2FA}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </>
      )}
      {verified && <p className="text-green-600">Two-Factor Authentication enabled successfully!</p>}
    </div>
  );
};

export default TwoFactorAuth;

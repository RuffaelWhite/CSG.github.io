import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import User from '../models/User.js';

const router = express.Router();

// Generate 2FA secret and QR code
router.post('/generate', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

    res.json({ qrCodeDataURL, secret: secret.base32 });
  } catch (error) {
    res.status(500).json({ message: 'Error generating 2FA secret', error });
  }
});

// Verify 2FA token
router.post('/verify', async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not setup for user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA token', error });
  }
});

export default router;

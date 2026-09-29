import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, passwordHashMap } from '../data/store.ts';
import { validateLocationBackend } from '../utils/locationValidator.ts';
import { authMiddleware, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword, state, district, city, profileImage } = req.body;

    if (!name || !email || !phone || !password || !district || !city) {
      return res.status(400).json({ error: 'Please provide all required fields including Tamil Nadu district and city.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // STRICT TAMIL NADU LOCATION VALIDATION
    const locationCheck = validateLocationBackend(state || 'Tamil Nadu', district, city);
    if (!locationCheck.valid) {
      return res.status(400).json({ error: locationCheck.error });
    }

    // Check existing email
    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Check existing phone
    if (db.getUserByPhone(phone)) {
      return res.status(400).json({ error: 'An account with this mobile number already exists.' });
    }

    const newUser = db.createUser({
      name,
      email,
      phone,
      state: 'Tamil Nadu',
      district,
      city,
      profileImage,
      password,
      role: 'user'
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account created successfully in Tamil Nadu region.',
      token,
      user: newUser
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed.';
    return res.status(400).json({ error: message });
  }
});

// POST /api/auth/login
router.post('/login', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { identifier, password } = req.body; // email or mobile number

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please enter your email / mobile number and password.' });
    }

    const trimmed = identifier.trim();
    let user = db.getUserByEmail(trimmed);
    if (!user) {
      user = db.getUserByPhone(trimmed);
    }

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email or mobile number.' });
    }

    const storedHash = passwordHashMap.get(user.id);
    let isPasswordValid = false;

    if (storedHash) {
      isPasswordValid = bcrypt.compareSync(password, storedHash);
    } else if (password === 'password123') {
      // Fallback for seed test accounts
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Logged in successfully.',
      token,
      user
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone, district, city, bio, profileImage } = req.body;

    // If updating location, strictly check Tamil Nadu
    if (district || city) {
      const val = validateLocationBackend('Tamil Nadu', district || req.user!.district, city || req.user!.city);
      if (!val.valid) {
        return res.status(400).json({ error: val.error });
      }
    }

    const updatedUser = db.updateUser(userId, {
      name,
      phone,
      district,
      city,
      bio,
      profileImage
    });

    return res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Profile update failed.';
    return res.status(400).json({ error: message });
  }
});

export default router;

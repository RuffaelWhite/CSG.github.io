import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in environment variables');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existingAdmin = await User.findOne({ username: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists');
    mongoose.disconnect();
    return;
  }

  const password = 'admin2';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const adminUser = new User({
    username: 'admin',
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    verified: true,
  });

  await adminUser.save();
  console.log('Admin user created with username: admin and password: admin2');

  mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error('Error creating admin user:', err);
  mongoose.disconnect();
});

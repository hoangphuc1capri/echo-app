import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echo';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@echo.vn';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });

    if (existingAdmin) {
      console.log(`Admin user ${adminEmail} already exists.`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      const admin = await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Quản trị viên',
        role: 'admin',
      });

      console.log(`Admin user created:`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${adminPassword}`);
      console.log(`  Role: ${admin.role}`);
    }

    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

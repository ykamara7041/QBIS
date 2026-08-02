import { db } from './src/lib/db.js';
import bcrypt from 'bcryptjs';

async function testAuthorize() {
  try {
    const email = "admin@demo.com";
    const password = "password123";

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      console.log("User not found or no password hash.");
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log("Password valid:", isValid);
  } catch (e) {
    console.error("Error during authorize test:", e);
  } finally {
    process.exit(0);
  }
}

testAuthorize();

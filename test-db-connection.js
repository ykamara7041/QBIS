import { db } from './src/lib/db.js';

async function main() {
  try {
    console.log("Testing database connection...");
    const count = await db.user.count();
    console.log("Current user count:", count);

    console.log("Trying to find a dummy user...");
    const user = await db.user.findUnique({
      where: { email: 'test_connection@demo.com' }
    });
    console.log("User lookup successful, result:", user);
    
    console.log("Database connection works perfectly!");
  } catch (error) {
    console.error("Database connection failed!");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();

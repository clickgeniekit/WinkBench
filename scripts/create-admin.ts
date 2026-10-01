#!/usr/bin/env tsx
/**
 * WinkBench Initial Administrator Provisioning Script
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts --email <admin-email> --password <strong-password> [--name "Admin Name"]
 *
 * Or via environment variables:
 *   ADMIN_BOOTSTRAP_EMAIL=admin@domain.com ADMIN_BOOTSTRAP_PASSWORD=secret npx tsx scripts/create-admin.ts
 */

import { findUserByEmail, createUser, updateUser } from '../lib/storage/db';
import { hashPassword } from '../lib/auth/password';

function parseArgs(): { email?: string; password?: string; name?: string } {
  const args = process.argv.slice(2);
  const result: { email?: string; password?: string; name?: string } = {
    email: process.env.ADMIN_BOOTSTRAP_EMAIL,
    password: process.env.ADMIN_BOOTSTRAP_PASSWORD,
    name: process.env.ADMIN_BOOTSTRAP_NAME || 'Platform Administrator',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      result.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      result.password = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      result.name = args[i + 1];
      i++;
    }
  }

  return result;
}

async function main() {
  const { email, password, name } = parseArgs();

  if (!email || !password) {
    console.error('Error: Both --email and --password are required.');
    console.log('\nUsage:\n  npx tsx scripts/create-admin.ts --email admin@example.com --password YourStrongPassword123!\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const existing = findUserByEmail(email);
  const passwordHash = hashPassword(password);

  if (existing) {
    console.log(`User <${email}> already exists. Promoting to admin and updating password...`);
    updateUser(existing.id, {
      role: 'admin',
      status: 'active',
      passwordHash,
      displayName: name || existing.displayName,
    });
    console.log(`Success: User <${email}> has been granted administrator role.`);
  } else {
    console.log(`Creating new administrator account for <${email}>...`);
    const newUser = createUser({
      email,
      passwordHash,
      displayName: name || 'Platform Administrator',
      role: 'admin',
    });
    console.log(`Success: Administrator account created with ID: ${newUser.id}`);
  }
}

main().catch((err) => {
  console.error('Fatal error during admin creation:', err);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script handles Prisma database migrations with the ability to:
 * - Generate migrations
 * - Apply migrations
 * - Reset the database (with confirmation)
 * - Seed the database with initial data
 */

import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if Prisma is installed
try {
  execSync('npx prisma -v', { stdio: 'ignore' });
} catch (error) {
  console.error('Prisma CLI is not installed. Please run: npm install prisma -D');
  process.exit(1);
}

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];
const migrationName = args[1];

// Execute command based on user input
switch (command) {
  case 'create':
    if (!migrationName) {
      console.error('Migration name is required. Usage: node db-migrate.js create <migration-name>');
      process.exit(1);
    }
    createMigration(migrationName);
    break;
  
  case 'apply':
    applyMigrations();
    break;
  
  case 'reset':
    confirmReset();
    break;
  
  case 'seed':
    seedDatabase();
    break;
  
  case 'status':
    checkMigrationStatus();
    break;
  
  default:
    showHelp();
    break;
}

// Create a new migration
function createMigration(name) {
  console.log(`Creating migration: ${name}...`);
  try {
    execSync(`npx prisma migrate dev --name ${name}`, { stdio: 'inherit' });
    console.log('Migration created successfully!');
  } catch (error) {
    console.error('Failed to create migration:', error.message);
  }
  process.exit(0);
}

// Apply pending migrations
function applyMigrations() {
  console.log('Applying pending migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Failed to apply migrations:', error.message);
  }
  process.exit(0);
}

// Reset the database (with confirmation)
function confirmReset() {
  rl.question('⚠️ This will DELETE ALL DATA in the database. Are you sure? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
      console.log('Resetting database...');
      try {
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
        console.log('Database reset successful!');
      } catch (error) {
        console.error('Failed to reset database:', error.message);
      }
    } else {
      console.log('Database reset cancelled.');
    }
    rl.close();
    process.exit(0);
  });
}

// Seed the database with initial data
function seedDatabase() {
  console.log('Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error.message);
  }
  process.exit(0);
}

// Check migration status
function checkMigrationStatus() {
  console.log('Checking migration status...');
  try {
    execSync('npx prisma migrate status', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to check migration status:', error.message);
  }
  process.exit(0);
}

// Show help information
function showHelp() {
  console.log(`
Database Migration Script
-------------------------
Usage: node db-migrate.js <command> [options]

Commands:
  create <name>  Create a new migration
  apply          Apply pending migrations
  reset          Reset the database (will delete ALL data)
  seed           Seed the database with initial data
  status         Check migration status
  help           Show this help message

Examples:
  node db-migrate.js create add-users-table
  node db-migrate.js apply
  node db-migrate.js reset
  node db-migrate.js seed
  node db-migrate.js status
  `);
  process.exit(0);
} 
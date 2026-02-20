#!/usr/bin/env node

/**
 * Mastercard CLI - Main Entry Point
 *
 * Production-ready CLI for Mastercard Locations API
 * ATM and merchant location services
 */

import('../src/index.js').catch(err => {
  console.error('Failed to start CLI:', err);
  process.exit(1);
});

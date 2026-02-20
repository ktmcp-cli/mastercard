# Mastercard CLI - Agent Guide

This CLI provides access to the Mastercard Locations API for finding ATMs and merchants.

## Quick Start

```bash
# Configure API key
mastercard config set apiKey YOUR_API_KEY

# Search for ATMs
mastercard atms search --lat 37.7749 --lng -122.4194 --radius 5 --json

# Find nearest ATMs
mastercard atms nearby --lat 37.7749 --lng -122.4194 --count 5 --json

# Search for merchants
mastercard merchants search --lat 37.7749 --lng -122.4194 --category restaurant --json

# Find nearest merchants
mastercard merchants nearby --lat 37.7749 --lng -122.4194 --count 5 --json
```

## Available Commands

- `config` - Manage configuration (set, get, list, clear)
- `atms search` - Search for ATMs near a location
- `atms nearby` - Find nearest ATMs
- `merchants search` - Search for merchants near a location
- `merchants nearby` - Find nearest merchants

## Output Format

All commands support `--json` flag for machine-readable output. Use this flag when calling from AI agents.

## Error Handling

If a command fails, it will exit with code 1 and print an error message to stderr.

## Authentication

The CLI uses an API key for authentication. Set it using:
- `mastercard config set apiKey <key>`
- Or environment variable: `MASTERCARD_API_KEY`

Get your API key from: https://developer.mastercard.com/

# Financial Tracker

Local-first financial tracker built with Next.js (App Router), TypeScript, Tailwind, and `localStorage`.

## Encrypted Financial Vault

This application includes an optional "Encrypted Financial Vault" mode to protect your financial data.

### Vault Format

When enabled, your data is stored in `localStorage` as a single JSON object with the following structure:

```json
{
  "version": 1,
  "kdf": {
    "saltB64": "...",
    "iterations": 100000
  },
  "cipher": {
    "ivB64": "...",
    "ciphertextB64": "..."
  }
}
```

### Security

- **Encryption**: Data is encrypted using AES-GCM (256-bit) via the native WebCrypto API.
- **Key Derivation**: The encryption key is derived from your passphrase using PBKDF2 with SHA-256, a random 16-byte salt, and 100,000 iterations.
- **Local-only**: Your passphrase and decrypted data never leave your browser. The encryption key is held only in memory and is cleared when you lock the vault or close the tab.

### Caveats & Recovery

- **No Passphrase Reset**: Since there is no backend, there is no "Forgot Passphrase" recovery option. If you lose your passphrase, your data is permanently inaccessible.
- **Recovery limitations**: You can export your encrypted vault as a JSON file for backup. To recover, you must import this file and provide the original passphrase.
- **Browser Storage**: Clearing your browser's site data or local storage will delete your vault and all transactions. Always keep an export if the data is important.

## Quickstart

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – lint (Next.js ESLint)
- `npm run typecheck` – TypeScript check
- `npm run test` – unit tests (Vitest)
- `npm run test:watch` – unit tests (watch)
- `npm run test:run` – unit tests (CI)

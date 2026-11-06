# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues or pull requests. Use the repository host's private vulnerability-reporting feature to contact the maintainers. If that feature is unavailable, contact the maintainers privately through the host before sharing technical details.

Include the affected component, impact, steps to reproduce, and any suggested mitigation. Please allow maintainers reasonable time to investigate and release a fix before public disclosure.

## Secrets and Firebase

- Never commit `.env`, Firebase service-account credentials, signing keys, or other secrets.
- The `EXPO_PUBLIC_FIREBASE_*` client configuration values are embedded in client builds and are not secrets. Protect user data with Firebase Authentication and the Realtime Database rules in `database.rules.json`.
- If a credential is accidentally exposed, revoke or rotate it in its provider console immediately.

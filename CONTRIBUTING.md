# Contributing

Thanks for your interest in improving Kainan!

## Before you start

- Check existing issues and pull requests before starting large changes.
- Feature ideas and suggestions are welcome. Open an issue describing the problem and your proposed solution.
- The project owner reviews and approves feature ideas. Do not start implementing a new feature until the owner has explicitly approved it.
- The project owner is responsible for running and building APKs. Do not start an EAS or other APK build on the owner's behalf.
- Keep changes focused and preserve the Android, iOS, and web experiences.
- Do not include credentials, private user data, or files from `.env`.
- Only contribute recipes, images, icons, and other content that you created or are authorized to redistribute. Include attribution and license details where required.

## Local setup

1. Install Node.js 22.13 or newer and npm.
2. Clone the repository and install its locked dependencies:

   ```bash
   npm ci
   ```

3. For Firebase features, copy `.env.example` to `.env` and configure a Firebase project. See the Firebase setup section in the README.
4. Start the browser preview with `npm start`. Use `npm run android` or `npm run ios` for native development.

## Code contributions

After a change is approved, coordinate implementation with the owner before opening a pull request. Run the checks that cover your changes:

```bash
npm run check
npx expo export --platform web
npx expo export --platform android
```

In the pull request description, explain the approved, user-visible change, list the checks you ran, and include screenshots for visual changes. Keep commits and pull requests focused and describe any limitations. The project owner will review and decide whether to merge.

By submitting a contribution, you agree that it is provided under the Apache License 2.0, as described in `LICENSE`.

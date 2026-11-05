# Kainan: Filipino meals for the UK and Philippines

Weekly Filipino meal plans for people in the UK and the Philippines, with local currency, supermarket choices, and grocery estimates.

## Run it

```bash
npm install
npx expo install --fix      # aligns every package to your Expo SDK (config targets SDK 56)
npm start                   # start Expo (Android is the primary target)
npm run android             # launch on an Android emulator
npm run ios                 # launch on an iOS simulator (macOS required)
npm run build:apk           # build an installable Android APK with EAS
npm run check               # planner + grocery logic checks (plain Node, no Expo needed)
```

The APK build uses Expo Application Services (EAS): sign in with `npx eas login`, then run `npm run build:apk`. For cloud saves in the APK, also add the `EXPO_PUBLIC_FIREBASE_*` values from `.env` to the EAS project's environment variables before building. The `preview` profile produces an installable APK; the `production` profile produces an Android App Bundle for Play Store submission.

## What's in it

| Feature | Where |
| --- | --- |
| Onboarding: country, diet, allergies, calories, people, local weekly budget, supermarket, pantry | `src/screens/Onboarding.jsx` |
| 7-day plan (almusal / tanghalian / hapunan), swap any meal, budget bar | `src/screens/PlanScreen.js`, `src/planner.js` |
| API-backed browser for 100 Filipino dishes, with images, ingredient icons, type filters and ingredient search | `src/screens/RecipesScreen.jsx`, `src/api/filipinoFood.js` |
| Meal detail with ingredients scaled to household size | `src/screens/MealDetail.jsx` |
| Grocery list by aisle, pantry removed, checkable, shareable | `src/screens/GroceryScreen.jsx`, `src/shopping.js` |
| Pantry picker | `src/screens/PantryScreen.js` |
| 38 Filipino meals, 63 ingredients | `src/data/meals.js`, `src/data/ingredients.js` |
| UK and Philippines supermarket choices, local currencies, rough market price estimates | `MARKETS` and `STORES_BY_MARKET` in `src/planner.js` |

State is saved on the device with AsyncStorage, so the plan and checked items survive restarts. Completed onboarding settings are also saved to Firebase under an anonymous, installation-specific account. Choose the UK or Philippines during setup or change it in Settings. The recipe browser loads dishes and popular ingredients from the Filipino Food API and needs an internet connection. Meal planning and grocery estimates continue to use local serving quantities, calories and rough regional price estimates because the API does not provide those values.

## Firebase setup

1. Create a Firebase project and register a web app to get its Firebase app configuration.
2. Enable **Authentication → Sign-in method → Anonymous** and create a **Realtime Database** in the same project.
3. Set `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, and `EXPO_PUBLIC_FIREBASE_APP_ID` in `.env`. Set `EXPO_PUBLIC_FIREBASE_DATABASE_URL` to the URL shown under **Realtime Database → Data** in Firebase Console. The app can derive the database URL for the `asia-southeast1` region if this variable is omitted. These are client configuration values; never put a service-account private key in the app.
4. Publish `database.rules.json` to the project's Realtime Database, then restart Expo so it loads the environment variables.

Onboarding is written once when setup is completed to `/users/{anonymous-user-id}`. **Settings → Danger zone → Reset all data** deletes that user's profile and clears the app's local data. A one-minute local cooldown prevents accidental repeated deletes.

## Known gaps

- **Prices are placeholders.** UK and Philippines ingredient prices and store multipliers are rough planning estimates, not live shelf prices.
- **No cooking steps yet.** Each meal has ingredients, calories and cost only.
- **Calories are estimates**, not nutrition advice. "No pork" is a filter, not a halal certification.
- **Small pools for strict diets:** vegetarian has 4 / 3 / 2 meals per slot, so plans repeat a lot.
- **Not yet built:** subscription/paywall, app icon and splash, Tagalog UI toggle, merienda slot, cloud sync for plans, pantry and grocery state.
- Native device testing is still needed before release.

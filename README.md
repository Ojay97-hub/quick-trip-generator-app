# Quick Trip Generator

A React Native Expo app that generates personalized day trip itineraries using Claude AI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Create a `.env` file in the root directory with your API keys:
   ```
   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
   EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=...
   ```

3. Run the app locally (Recommended for testing):
   ```bash
   npx expo start
   ```
   - Scan the QR code with the Expo Go app on your iPhone.

## Building for iOS Simulator (Mac only)

If you don't have an Apple Developer Account, you can build for the iOS Simulator:

```bash
npx eas-cli build --platform ios --profile simulator
```

## Features

- **Trip Generation**: Personalized itineraries based on time, budget, and interests.
- **AI Integration**: Uses Anthropic's Claude 3 for itinerary creation.
- **Visuals**: Fetches location images from Unsplash.
- **Saved Trips**: Persists your favorite trips locally.
- **Design**: Custom UI with Tailwind CSS (NativeWind).

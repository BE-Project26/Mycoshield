# MycoShield

Oyster mushroom health and contamination screening. Frontend only: React, TypeScript, Tailwind CSS, Vite.

    npm install
    npm run dev

## Connecting a real model
All screening goes through `ScreeningService` in `src/services/screening.ts`. Implement `screen(file, batch)`
against your inference endpoint, return a `Screening`, and pass it to `<ScreeningProvider service={...}>` in `src/main.tsx`.
Condition labels and advice live in `src/data/conditions.ts`.

## Sign in and registration
`src/context/AuthContext.tsx` is a mock: it accepts any valid email and a password of 8+ characters, stores no password,
and keeps only the display profile in localStorage. Replace `signIn` and `register` with real API calls.

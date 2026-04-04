# Backend API Integration Walkthrough

I have fully integrated the Vercel backend API into your Next.js frontend application! Below is a summary of all the modifications made across the codebase to transition from synchronous local state to asynchronous remote API calls.

## Core Implementations

### API Wrapper (`src/lib/api.ts`)
- Created a robust `fetch` wrapper designed to interface with `https://inventory-backend-d.vercel.app/api/v1`.
- Automatically attaches the Bearer token (JWT) from `localStorage` to authenticated requests.
- Maps error payloads consistently for easy consumption by the UI.

### Global Store Refactoring (`src/lib/store.tsx`)
- Transitioned all synchronous modifications (`addProduct`, `createOrder`, `removeCategory`, etc.) to return Promises.
- Stripped out the initial hardcoded fake `SEED` data. 
- Integrated real endpoints via the new `apiFetch` utility.
- Added a `fetchInitialData` initialization sequence on mount, utilizing `Promise.allSettled` to smoothly load data.
- Handled state updates locally *after* validating success responses from the remote API, preserving UX speed.

## Page/Component Integrations

- **Authentication Flows (`/login`, `/signup`)** 
  - Adjusted to use `await` before logging in/signing up.
  - Success responses store JWT credentials locally. Redirect to dashboard happens only if backend authenticates successfully.
- **Dashboard (`/dashboard`) & Activity Log (`/activity`)**
  - Time utilities modified to correctly parse ISO Date strings returned from the API payload (`"2026-04-03T...""`).
- **Data Tables (`/categories`, `/products`, `/orders`, `/restock`)**
  - Updated mapping logic recognizing standard relational DB structures (e.g. `c.name` vs plain strings). 
  - Buttons invoking state changes (creating rules, stocking products, checking off the restock queue) are all modified to act fully asynchronously. 
  - Addressed TypeScript mapping inconsistencies (e.g., `item.priority` checks mapping safely to default strings).

> [!TIP]
> Since we moved from an in-memory client-side fake state to a real networked API, any discrepancies or 500 server errors that might show up in the UI will now be accurately mirroring your deployed database logic! 

## Validation Checklist

1. **Authentication:** Try logging in with the specific route (`login/page.tsx`). A JWT should manifest in `accessToken` inside the browser's developer Application tab under Storage.
2. **Data Parity:** Ensure creating a brand new category pushes an actual `POST /category` to Vercel via the Network Tab.
3. **Queue Linking:** Creating an order through `/orders` dropping stock below `minThreshold` should manifest via your `activity-log` endpoint automatically.

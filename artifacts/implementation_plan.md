# Integrate Remote Backend API

The objective is to connect the Next.js frontend to the newly deployed Vercel backend API (`https://inventory-backend-d.vercel.app/api/v1`). Currently, the frontend uses an in-memory `AppStore` via React Context (`src/lib/store.tsx`). We need to replace the local, synchronous fake data operations with asynchronous remote API calls.

## Proposed Changes

### Configuration & Utilities
- **`src/lib/api.ts` [NEW]**: Create an API client wrapper around the native `fetch` API. It will handle the base URL (`https://inventory-backend-d.vercel.app/api/v1`), token injection from local storage for Authorization headers, error handling, and JSON parsing. 

### Global State (`src/lib/store.tsx`)
- **`src/lib/store.tsx` [MODIFY]**: 
  - Remove fake `SEED_` data.
  - Add standard generic loading/error states to manage async lifecycle (e.g., `isLoading`, `error`).
  - Introduce `fetchInitialData()` to fetch all resources (categories, products, orders, etc.) simultaneously or lazily on mount.
  - Refactor all mutation actions (`login`, `signup`, `addProduct`, `createOrder`, etc.) to return Promises. They will first fire the API request via `src/lib/api.ts`, wait for a successful response, and *then* update the local React state to keep the UI snappy and in sync with the server.
  - Add missing actions like `signup` (if missing from context).

### Components

#### Authentication
- **`src/app/(auth)/login/page.tsx` [MODIFY]**: Update the `login` function call to be `await login(...)` and handle loading states/errors. Store token on successful login.
- **`src/app/(auth)/signup/page.tsx` [MODIFY]**: Connect form to a new `signup` method in store or directly to API, handling redirect on success.

#### Main Application (Dashboards & Resources)
- **`src/app/(app)/dashboard/page.tsx` [MODIFY]**: Ensure it consumes the loaded data properly without acting on empty arrays before the initial fetch completes. Might need a global loading spinner.
- **`src/app/(app)/categories/page.tsx` [MODIFY]**: Update add/delete actions to `await` the store changes.
- **`src/app/(app)/products/page.tsx` [MODIFY]**: Update add/edit/delete product form submissions to handle async calls, display saving states.
- **`src/app/(app)/orders/page.tsx` [MODIFY]**: Refactor `createOrder`, status updates, and cancellations to be async. 
- **`src/app/(app)/restock/page.tsx` [MODIFY]**: Map to the remote `/restock-queue` endpoints (fetch queue, mark restocked, delete from queue).
- **`src/app/(app)/activity/page.tsx` [MODIFY]**: Connect to the remote `/activity-log` GET endpoint instead of local generic logs.

### Application Layout
- **`src/app/(app)/layout.tsx` (if exists) [MODIFY]**: Trigger global store initialization/fetch when an authenticated user enters the app layer.

## User Review Required

> [!WARNING]  
> Making store functions asynchronous is a breaking change for child components, requiring us to sprinkle `async`/`await` across the app components. Is it acceptable to add minimal loading spinners in components while mutations resolve? 

> [!IMPORTANT]  
> Authentication flow: Usually, on login, the backend gives a JWT. We will store this JWT in `localStorage` and pass it via `Authorization: Bearer <token>` in `lib/api.ts`. Let me know if you prefer cookies or a different auth strategy.

## Open Questions

1. **Mapping differences:** Do the fields in your backend schema exactly match the ones in `src/lib/store.tsx` (e.g., `minThreshold` vs backend schema, `customerName` vs whatever the backend order expects)? If there are discrepancies, I will map them as needed during integration. Is there an endpoint for "Dashboard Stats" or should we compute them locally from listing endpoints? 

## Verification Plan

### Automated/Manual Verification
- Inspect the browser sequence using `login` -> check local storage for token.
- Test creating a category, verify the network tab shows a successful POST request and the list updates.
- Test creating a product corresponding to the new category.
- Test creating an order and observing the stock quantity decrease locally and via the backend.
- View Restock Queue and Activity Log to verify backend real-time logging triggers.

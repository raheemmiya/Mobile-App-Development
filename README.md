## BookDestinationApp — React Native (Expo) + Firebase Realtime Database

This app lets users register/login (without Firebase Auth), add travel destinations, book other users’ destinations, see their own bookings, and delete their own bookings. Only the host who created a destination can delete it.

Built with Expo React Native, React Navigation, AsyncStorage (for session), and Firebase Realtime Database.

---

### 1) How the app works (plain English)

- **Register/Login (no Firebase Auth):**
  - When you register, we save your `username` and `password` in the Realtime Database under `users/` and also store the whole user object locally using AsyncStorage (this is your session).
  - When you login, we look up that `users/` list and try to find a matching `username` and `password`. If found, we store that user locally and take you to the Home screen.

- **Home screen:**
  - At the top, you can jump to “My Bookings” or Logout.
  - You can add a new destination by entering a title, description and price. It’s saved in the database under `destinations/` with your user id as the `hostId`.
  - You can see a list of all destinations. You can book any destination. You can only delete the ones you created (host-only delete).

- **Bookings screen:**
  - Shows the list of bookings created by you. You can delete your own bookings.

Notes:
- There is no Firebase Authentication on purpose, per requirements. Credentials are stored in plaintext in the DB for demo simplicity. Do not use this pattern for real apps.

---

### 2) Data stored in Firebase Realtime Database

We use three top-level paths: `users/`, `destinations/`, and `bookings/`.

- `users/{userId}`
  - `{ id, username, password }`

- `destinations/{destinationId}`
  - `{ id, title, description, price, hostId }`
  - `hostId` is the id of the user who created it. Only this user can delete it.

- `bookings/{bookingId}`
  - `{ id, destinationId, userId, createdAt }`
  - `userId` is the person who booked; they can delete their booking.

---

### 3) Files and what they do

#### App entry
- `App.js`
  - Renders the app’s navigation (`src/navigation`).

#### Navigation
- `src/navigation/index.tsx`
  - Sets up a Stack Navigator with 4 screens: `Login`, `Register`, `Home`, `Bookings`.
  - Navigation flow: Login/Register → Home → Bookings.

#### Firebase setup
- `src/services/firebase.ts`
  - Initializes Firebase using your provided config and exports `db` (Realtime Database instance).

#### Database helpers
- `src/services/db.ts`
  - Types:
    - `User` — `{ id, username, password }`
    - `Destination` — `{ id, title, description, price, hostId }`
    - `Booking` — `{ id, destinationId, userId, createdAt }`
  - Functions:
    - `registerUser(username, password)`
      - Ensures username isn’t taken, then creates a new user under `users/`.
    - `loginUser(username, password)`
      - Finds a user in `users/` with matching credentials.
    - `addDestination({ title, description, price, hostId })`
      - Adds a new destination under `destinations/`.
    - `deleteDestination(id, requesterId)`
      - Loads the destination and checks `hostId === requesterId`. If not, throws an error. If yes, deletes it.
    - `listDestinations()`
      - Returns all destinations as an array.
    - `bookDestination(destinationId, userId)`
      - Creates a record under `bookings/` for the current user.
    - `listUserBookings(userId)`
      - Returns the current user’s bookings, plus the destination details for each booking.
    - `deleteBooking(bookingId, requesterId)`
      - Only allows deletion if `booking.userId === requesterId`.

#### Session storage (local device)
- `src/storage/session.ts`
  - Uses AsyncStorage to save/load/clear the currently logged-in user object:
    - `saveUserSession(user)`
    - `loadUserSession()`
    - `clearUserSession()`

#### Screens (UI)
- `src/screens/LoginScreen.tsx`
  - If a saved session exists, it redirects to `Home` immediately.
  - Takes a username/password, calls `loginUser`, saves session, then goes to `Home`.

- `src/screens/RegisterScreen.tsx`
  - Takes a username/password, calls `registerUser`, saves session, then goes to `Home`.

- `src/screens/HomeScreen.tsx`
  - Loads the session; if none, navigates back to `Login`.
  - Loads all destinations and shows them.
  - Contains a form to add a destination (`DestinationForm`). The current user becomes `hostId`.
  - Each destination item (`DestinationItem`) lets you book it; delete is only shown for the host.
  - Has buttons to go to `My Bookings` and to `Logout`.

- `src/screens/BookingsScreen.tsx`
  - Loads the session; if none, navigates back to `Login`.
  - Loads the current user’s bookings with destination details.
  - Lets the user delete their own bookings.

#### Components
- `src/components/DestinationForm.tsx`
  - Simple form with inputs for `title`, `description`, `price` and a submit button.

- `src/components/DestinationItem.tsx`
  - Displays destination info, a Book button, and a Delete button (Delete visible only if `canDelete === true`).

---

### 4) Important rules enforced

- **No Firebase Auth used:** Sessions are local only (AsyncStorage). Users are looked up in the database by username/password.
- **Host-only delete:** Only the user whose `id` equals `destination.hostId` can delete that destination.
- **User-only booking deletion:** Only the user who created a booking can delete it.

---

### 5) Setup and running the app

Prerequisites: Node.js LTS, a device/emulator (Android recommended), and your Firebase Realtime Database enabled.

1. Install dependencies (done already during setup). If you run on web and see TypeScript warnings because we use `.tsx` files, install:
   - `npx expo install typescript @types/react`

2. Ensure your Firebase config is correct in `src/services/firebase.ts` (already added).

3. Start the app:
   - Android: `npm run android`
   - Web: `npm run web`

4. Basic flow:
   - Register a test user
   - Add a destination on Home
   - Book some destinations
   - View and delete your bookings under My Bookings
   - Try deleting a destination you don’t own — it will show an error

---

### 6) Security and limitations (for learning/demo only)

- Passwords are stored in plaintext in the database. This is insecure; in real apps use Firebase Auth or at least hash passwords.
- Realtime Database rules are not configured here. For production, define strict read/write rules to enforce host-only deletes and booking ownership on the server side.
- There’s no form validation beyond basics.

---

### 7) Troubleshooting

- Web complains: “trying to use TypeScript but don’t have the required dependencies installed”
  - Run: `npx expo install typescript @types/react`

- Web complains about `react-dom` or `react-native-web`
  - Run: `npx expo install react-dom react-native-web`

- Firebase permission errors
  - Check your Realtime Database rules in the Firebase console.

---

### 8) Where to change things

- Firebase config: `src/services/firebase.ts`
- Add/modify data operations: `src/services/db.ts`
- Session handling: `src/storage/session.ts`
- UI screens: `src/screens/*`
- UI components: `src/components/*`
- Navigation: `src/navigation/index.tsx`



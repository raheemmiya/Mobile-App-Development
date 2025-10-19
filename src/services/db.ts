import { db } from './firebase';
import { ref, push, onValue, set, remove, get, child } from 'firebase/database';

export type User = {
  id: string;
  username: string;
  password: string; // stored in plaintext for demo; do NOT do this in production
};

export type Destination = {
  id: string;
  title: string;
  description: string;
  price: number;
  hostId: string;
};

export type Booking = {
  id: string;
  destinationId: string;
  userId: string;
  createdAt: number;
};

// Users
export async function registerUser(username: string, password: string): Promise<User> {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    const users: Record<string, User> = snapshot.val();
    const exists = Object.values(users).some((u) => u.username === username);
    if (exists) {
      throw new Error('Username already taken');
    }
  }
  const newRef = push(usersRef);
  const user: User = { id: newRef.key as string, username, password };
  await set(newRef, user);
  return user;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) throw new Error('Invalid credentials');
  const users: Record<string, User> = snapshot.val();
  const match = Object.values(users).find((u) => u.username === username && u.password === password);
  if (!match) throw new Error('Invalid credentials');
  return match;
}

// Destinations
export async function addDestination(input: Omit<Destination, 'id'>): Promise<Destination> {
  const destRef = ref(db, 'destinations');
  const newRef = push(destRef);
  const destination: Destination = { id: newRef.key as string, ...input };
  await set(newRef, destination);
  return destination;
}

export async function deleteDestination(id: string, requesterId: string): Promise<void> {
  const destRef = ref(db, `destinations/${id}`);
  const snapshot = await get(destRef);
  if (!snapshot.exists()) return;
  const destination = snapshot.val() as Destination;
  if (destination.hostId !== requesterId) {
    throw new Error('Only the host can delete this destination');
  }
  await remove(destRef);
}

export async function listDestinations(): Promise<Destination[]> {
  const snapshot = await get(ref(db, 'destinations'));
  if (!snapshot.exists()) return [];
  const data: Record<string, Destination> = snapshot.val();
  return Object.values(data);
}

// Bookings
export async function bookDestination(destinationId: string, userId: string): Promise<Booking> {
  const bookingsRef = ref(db, 'bookings');
  const newRef = push(bookingsRef);
  const booking: Booking = { id: newRef.key as string, destinationId, userId, createdAt: Date.now() };
  await set(newRef, booking);
  return booking;
}

export async function listUserBookings(userId: string): Promise<(Booking & { destination?: Destination })[]> {
  const snapshot = await get(ref(db, 'bookings'));
  if (!snapshot.exists()) return [];
  const bookings: Record<string, Booking> = snapshot.val();
  const mine = Object.values(bookings).filter((b) => b.userId === userId);
  const destinations = await listDestinations();
  const destById = new Map(destinations.map((d) => [d.id, d]));
  return mine.map((b) => ({ ...b, destination: destById.get(b.destinationId) }));
}

export async function deleteBooking(bookingId: string, requesterId: string): Promise<void> {
  const bookingRef = ref(db, `bookings/${bookingId}`);
  const snapshot = await get(bookingRef);
  if (!snapshot.exists()) return;
  const booking = snapshot.val() as Booking;
  if (booking.userId !== requesterId) throw new Error('You can only delete your own booking');
  await remove(bookingRef);
}




import type { User } from './types';
import { subDays, formatISO } from 'date-fns';

let users: User[] = [
  {
    id: 'usr123456789',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    roles: 'ROLE_USER,ROLE_ADMIN',
    jobTitle: 'Software Engineer',
    createdDate: formatISO(subDays(new Date(), 60)),
    updatedDate: formatISO(subDays(new Date(), 5)),
    lastLoginDate: formatISO(subDays(new Date(), 1)),
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  },
  {
    id: 'usr987654321',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    password: 'anotherPassword456',
    roles: 'ROLE_MANAGER',
    jobTitle: 'Product Manager',
    createdDate: formatISO(subDays(new Date(), 120)),
    updatedDate: formatISO(subDays(new Date(), 10)),
    lastLoginDate: formatISO(subDays(new Date(), 2)),
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  },
  {
    id: 'usr555555555',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    password: 'passwordBob789',
    roles: 'ROLE_EDITOR',
    jobTitle: 'Content Writer',
    createdDate: formatISO(subDays(new Date(), 30)),
    updatedDate: formatISO(subDays(new Date(), 2)),
    lastLoginDate: null,
    accountNonExpired: true,
    accountNonLocked: false, // Example of locked account
    credentialsNonExpired: true,
    enabled: false, // Example of disabled account
  },
  {
    id: 'usr112233445',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@example.com',
    password: 'carolSecurePass',
    roles: 'ROLE_USER',
    jobTitle: 'UX Designer',
    createdDate: formatISO(subDays(new Date(), 200)),
    updatedDate: formatISO(subDays(new Date(), 15)),
    lastLoginDate: formatISO(subDays(new Date(), 7)),
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  },
  {
    id: 'usr667788990',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    password: 'davidPass123',
    roles: 'ROLE_SUPPORT',
    jobTitle: 'Support Specialist',
    createdDate: formatISO(subDays(new Date(), 90)),
    updatedDate: formatISO(subDays(new Date(), 3)),
    lastLoginDate: formatISO(subDays(new Date(), 0)),
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  }
];

// Simulate a delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUsers(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  roleFilter?: string
): Promise<{ users: User[]; total: number }> {
  await delay(300);
  let filteredUsers = [...users];

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.firstName.toLowerCase().includes(lowerSearchTerm) ||
      user.lastName.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.roles.toLowerCase().includes(lowerSearchTerm)
    );
  }

  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.roles.split(',').map(r => r.trim()).includes(roleFilter)
    );
  }

  const total = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);
  return { users: paginatedUsers.map(u => ({...u, password: undefined })), total };
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay(200);
  const user = users.find(user => user.id === id);
  return user ? {...user, password: undefined} : undefined;
}

export async function createUser(userData: Omit<User, 'id' | 'createdDate' | 'updatedDate'>): Promise<User> {
  await delay(500);
  const newUser: User = {
    ...userData,
    id: `usr${Date.now()}${Math.floor(Math.random() * 1000)}`,
    createdDate: formatISO(new Date()),
    updatedDate: formatISO(new Date()),
    lastLoginDate: null, // New users haven't logged in
  };
  users.unshift(newUser); // Add to the beginning of the array
  return {...newUser, password: undefined};
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdDate' | 'password'>>): Promise<User | undefined> {
  await delay(500);
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedDate: formatISO(new Date()),
  };
  const updatedUser = users[userIndex];
  return {...updatedUser, password: undefined};
}

export async function deleteUser(id: string): Promise<boolean> {
  await delay(500);
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
}

export async function getCurrentUser(): Promise<User | undefined> {
  // Simulate fetching the currently logged-in user
  // For now, return the first user or a specific one
  await delay(100);
  if (users.length > 0) {
    const user = users[0];
    return {...user, password: undefined};
  }
  return undefined;
}

export async function getUniqueRoles(): Promise<string[]> {
  await delay(100);
  const allRoles = new Set<string>();
  users.forEach(user => {
    user.roles.split(',').map(role => role.trim()).forEach(role => {
      if (role) allRoles.add(role);
    });
  });
  return Array.from(allRoles).sort();
}

export async function changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<{success: boolean, message: string}> {
  await delay(600);
  const user = users.find(u => u.id === userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  // In a real app, you'd verify the currentPassword against a hash
  // For this dummy service, we'll just simulate success if newPassword is provided
  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters." };
  }
  // "Update" password (not actually stored or hashed here)
  user.password = newPassword; // In real app, hash this
  user.updatedDate = formatISO(new Date());
  user.credentialsNonExpired = true; // Typically reset on password change
  return { success: true, message: "Password changed successfully." };
}

// Add some more users for pagination and variety
const moreFirstNames = ["Emily", "Michael", "Sarah", "James", "Jessica", "Daniel", "Linda", "Robert", "Patricia", "Chris"];
const moreLastNames = ["Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson"];
const exampleRoles = ["ROLE_USER", "ROLE_EDITOR", "ROLE_GUEST", "ROLE_SUPPORT"];
const jobTitles = ["Data Analyst", "Marketing Specialist", "HR Manager", "Sales Representative", "Operations Lead"];

for (let i = 0; i < 15; i++) {
  const firstName = moreFirstNames[i % moreFirstNames.length];
  const lastName = moreLastNames[i % moreLastNames.length];
  users.push({
    id: `usr-extra-${i}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    password: 'dummyPassword',
    roles: exampleRoles[i % exampleRoles.length] + (i % 3 === 0 ? ",ROLE_USER" : ""),
    jobTitle: jobTitles[i % jobTitles.length],
    createdDate: formatISO(subDays(new Date(), Math.floor(Math.random() * 365))),
    updatedDate: formatISO(subDays(new Date(), Math.floor(Math.random() * 30))),
    lastLoginDate: Math.random() > 0.3 ? formatISO(subDays(new Date(), Math.floor(Math.random() * 7))) : null,
    accountNonExpired: Math.random() > 0.1,
    accountNonLocked: Math.random() > 0.05,
    credentialsNonExpired: Math.random() > 0.05,
    enabled: Math.random() > 0.15,
  });
}

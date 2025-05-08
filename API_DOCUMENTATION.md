
# User Hub API Documentation

## 1. Introduction

The User Hub application primarily utilizes Next.js Server Components and Server Actions. This means that instead of traditional REST or GraphQL API endpoints, data fetching and mutations are handled by:

*   **Server Components**: These components fetch data directly on the server using asynchronous functions.
*   **Server Actions**: These are functions executed on the server, callable from client components, typically for form submissions and data mutations.
*   **Genkit Flows**: AI-powered functionalities are exposed as server-side flows, which are also invoked as Server Actions.

This document outlines the key server-side functions that form the application's "API" layer.

## 2. AI Services (Genkit Flows)

These services leverage Genkit for AI-powered features.

### 2.1 Suggest User Roles

*   **Purpose**: Suggests user roles based on a given job title.
*   **Method**: Server Action (Genkit Flow)
*   **File Path**: `src/ai/flows/suggest-user-roles.ts`
*   **Function**: `async function suggestUserRoles(input: SuggestUserRolesInput): Promise<SuggestUserRolesOutput>`
*   **Input Schema (`SuggestUserRolesInput`)**:
    ```typescript
    {
      jobTitle: string; // The job title of the user.
    }
    ```
*   **Output Schema (`SuggestUserRolesOutput`)**:
    ```typescript
    {
      suggestedRoles: string[]; // An array of suggested roles.
    }
    ```
*   **Example Invocation (Client Component)**:
    ```typescript
    import { suggestUserRoles } from '@/ai/flows/suggest-user-roles';

    async function handleSuggest(jobTitle: string) {
      const result = await suggestUserRoles({ jobTitle });
      // Process result.suggestedRoles
    }
    ```

## 3. User Management API

Functions related to managing user data. These are typically used by Server Components for reads or invoked as Server Actions for mutations.

### 3.1 Get Users

*   **Purpose**: Fetches a paginated and optionally filtered list of users.
*   **Method**: Server Component Data Fetch
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function getUsers(page: number = 1, limit: number = 10, searchTerm?: string, roleFilter?: string): Promise<{ users: User[]; total: number }>`
*   **Parameters**:
    *   `page` (optional, number): The page number for pagination (default: 1).
    *   `limit` (optional, number): The number of users per page (default: 10).
    *   `searchTerm` (optional, string): A term to search by (name, email, role).
    *   `roleFilter` (optional, string): A specific role to filter users by.
*   **Returns**: An object containing an array of `User` objects and the `total` count of users matching the criteria.
*   **User Object Structure**: See `src/lib/types.ts` for the `User` interface.

### 3.2 Get User By ID

*   **Purpose**: Fetches a single user by their unique ID.
*   **Method**: Server Component Data Fetch
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function getUserById(id: string): Promise<User | undefined>`
*   **Parameters**:
    *   `id` (string): The unique identifier of the user.
*   **Returns**: A `User` object if found, otherwise `undefined`.

### 3.3 Create User

*   **Purpose**: Creates a new user.
*   **Method**: Server Action
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function createUser(userData: Omit<User, 'id' | 'createdDate' | 'updatedDate'>): Promise<User>`
*   **Parameters**:
    *   `userData`: An object containing user details (excluding `id`, `createdDate`, `updatedDate`).
*   **Returns**: The newly created `User` object.

### 3.4 Update User

*   **Purpose**: Updates an existing user's information.
*   **Method**: Server Action
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdDate' | 'password'>>): Promise<User | undefined>`
*   **Parameters**:
    *   `id` (string): The ID of the user to update.
    *   `updates`: An object containing the fields to update.
*   **Returns**: The updated `User` object if successful, otherwise `undefined`.

### 3.5 Delete User

*   **Purpose**: Deletes a user from the system.
*   **Method**: Server Action
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function deleteUser(id: string): Promise<boolean>`
*   **Parameters**:
    *   `id` (string): The ID of the user to delete.
*   **Returns**: `true` if deletion was successful, `false` otherwise.

### 3.6 Get Current User

*   **Purpose**: Fetches data for the "currently logged-in" user (mocked).
*   **Method**: Server Component Data Fetch / Server Action
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function getCurrentUser(): Promise<User | undefined>`
*   **Returns**: The `User` object for the current user, or `undefined` if not found/logged in.

### 3.7 Get Unique Roles

*   **Purpose**: Retrieves a list of all unique roles assigned to users in the system.
*   **Method**: Server Component Data Fetch
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function getUniqueRoles(): Promise<string[]>`
*   **Returns**: An array of unique role strings.

### 3.8 Change Password

*   **Purpose**: Allows a user to change their password.
*   **Method**: Server Action
*   **File Path**: `src/lib/users.ts`
*   **Function**: `async function changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<{success: boolean, message: string}>`
*   **Parameters**:
    *   `userId` (string): The ID of the user changing their password.
    *   `currentPassword` (optional, string): The user's current password (for verification).
    *   `newPassword` (optional, string): The new password.
*   **Returns**: An object indicating success status and a message.

## 4. Audit Log API

Functions related to accessing audit log data.

### 4.1 Get Audit Logs

*   **Purpose**: Fetches a paginated list of audit logs.
*   **Method**: Server Component Data Fetch
*   **File Path**: `src/lib/audit-logs.ts`
*   **Function**: `async function getAuditLogs(page: number = 1, limit: number = 10): Promise<{ logs: AuditLog[]; total: number }>`
*   **Parameters**:
    *   `page` (optional, number): Page number for pagination (default: 1).
    *   `limit` (optional, number): Number of logs per page (default: 10).
*   **Returns**: An object containing an array of `AuditLog` objects and the `total` count.
*   **AuditLog Object Structure**: See `src/lib/types.ts` for the `AuditLog` interface.

## 5. Notification API

Functions related to accessing notification data.

### 5.1 Get Notifications

*   **Purpose**: Fetches notifications for the current user.
*   **Method**: Server Component Data Fetch
*   **File Path**: `src/lib/notifications.ts`
*   **Function**: `async function getNotifications(): Promise<{ notifications: NotificationMessage[]; total: number, unreadCount: number }>`
*   **Returns**: An object containing an array of `NotificationMessage` objects, the `total` count, and the `unreadCount`.
*   **NotificationMessage Object Structure**: See `src/lib/types.ts` for the `NotificationMessage` interface.

## 6. Simulated Form Submissions (Client-Side Actions)

Certain pages like "Contact Support" (`src/app/contact-support/page.tsx`) and "Feedback" (`src/app/feedback/page.tsx`) use client-side form handling that simulates a submission to a backend. Currently, these do not call dedicated API functions in `src/lib` or `src/ai` but handle the logic (like showing a toast message) directly within the client component.

*   **Contact Support Form**:
    *   **File Path**: `src/app/contact-support/page.tsx`
    *   **Action**: `onSubmit` function within the component.
    *   **Simulates**: Sending a support request with name, email, subject, inquiry type, message, and an optional attachment.
*   **Feedback Form**:
    *   **File Path**: `src/app/feedback/page.tsx`
    *   **Action**: `onSubmit` function within the component.
    *   **Simulates**: Submitting feedback with type, optional email, subject, and message.

---

*This documentation reflects the current state of the application. As features evolve, this document should be updated.*

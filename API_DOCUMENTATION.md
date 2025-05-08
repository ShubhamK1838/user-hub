
# User Hub Backend API Documentation

## 1. Introduction

This document outlines the backend API endpoints required for the User Hub application. These endpoints are designed to be consumed by the Next.js frontend, replacing direct server actions and data fetching where a separate backend is implemented.

All API responses should be in JSON format unless otherwise specified. Standard HTTP status codes should be used to indicate the outcome of requests.

## 2. Authentication

Most API endpoints require authentication. Authenticated requests should include a Bearer token in the `Authorization` header:

`Authorization: Bearer <YOUR_JWT_TOKEN>`

Endpoints that do not require authentication are typically public (e.g., login, register, forgot password).

## 3. API Endpoints

### 3.1 Authentication API

Endpoints related to user authentication and session management.

#### 3.1.1 Login User

*   **Endpoint**: `POST /api/auth/login`
*   **Description**: Authenticates a user and returns a session token and user details.
*   **Request Body**:
    ```json
    {
      "email": "string (email format)",
      "password": "string",
      "rememberMe": "boolean (optional)"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "token": "string (JWT)",
      "user": "User" // See User Object Structure
    }
    ```
*   **Response Body (Error - 400 Bad Request, 401 Unauthorized)**:
    ```json
    {
      "message": "string (error description)"
    }
    ```

#### 3.1.2 Register User

*   **Endpoint**: `POST /api/auth/register`
*   **Description**: Registers a new user.
*   **Request Body**:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string (email format)",
      "password": "string (min 8 characters)"
    }
    ```
*   **Response Body (Success - 201 Created)**:
    ```json
    {
      "user": "User" // See User Object Structure, default roles assigned by backend
    }
    ```
*   **Response Body (Error - 400 Bad Request, 409 Conflict)**:
    ```json
    {
      "message": "string (error description)"
    }
    ```

#### 3.1.3 Forgot Password

*   **Endpoint**: `POST /api/auth/forgot-password`
*   **Description**: Initiates the password reset process by sending an email to the user.
*   **Request Body**:
    ```json
    {
      "email": "string (email format)"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "message": "If an account exists for this email, a password reset link has been sent."
    }
    ```
    *(Note: Always return a generic success message for security reasons, regardless of whether the email exists.)*

#### 3.1.4 Reset Password

*   **Endpoint**: `POST /api/auth/reset-password`
*   **Description**: Resets the user's password using a token received via email.
*   **Request Body**:
    ```json
    {
      "token": "string (password reset token)",
      "newPassword": "string (min 8 characters)"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "message": "Password has been reset successfully."
    }
    ```
*   **Response Body (Error - 400 Bad Request)**:
    ```json
    {
      "message": "Invalid or expired token, or invalid password."
    }
    ```

#### 3.1.5 Get Current User (Authenticated)

*   **Endpoint**: `GET /api/auth/me`
*   **Description**: Fetches data for the currently authenticated user.
*   **Authentication**: Required.
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "user": "User" // See User Object Structure
    }
    ```
*   **Response Body (Error - 401 Unauthorized)**: If no valid token is provided.

#### 3.1.6 Change Password (Authenticated User)

*   **Endpoint**: `POST /api/auth/change-password`
*   **Description**: Allows the authenticated user to change their own password.
*   **Authentication**: Required.
*   **Request Body**:
    ```json
    {
      "currentPassword": "string",
      "newPassword": "string (min 8 characters)"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "message": "Password changed successfully."
    }
    ```
*   **Response Body (Error - 400 Bad Request, 401 Unauthorized)**:
    ```json
    {
      "success": false,
      "message": "string (error description, e.g., Incorrect current password)"
    }
    ```

### 3.2 User Management API

Endpoints for managing user accounts. Typically require admin privileges.

#### 3.2.1 Get Users List

*   **Endpoint**: `GET /api/users`
*   **Description**: Fetches a paginated and optionally filtered list of users.
*   **Authentication**: Required (Admin).
*   **Query Parameters**:
    *   `page` (optional, number): Page number (default: 1).
    *   `limit` (optional, number): Users per page (default: 10).
    *   `search` (optional, string): Search term (name, email, role).
    *   `role` (optional, string): Role to filter by (e.g., "ROLE_ADMIN").
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "users": ["User"], // Array of User objects, see User Object Structure
      "total": "number (total matching users)",
      "currentPage": "number",
      "totalPages": "number"
    }
    ```

#### 3.2.2 Get User By ID

*   **Endpoint**: `GET /api/users/{id}`
*   **Description**: Fetches a single user by their unique ID.
*   **Authentication**: Required (Admin or self).
*   **Path Parameters**:
    *   `id` (string): The unique identifier of the user.
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "user": "User" // See User Object Structure
    }
    ```
*   **Response Body (Error - 404 Not Found)**: If user with ID does not exist.

#### 3.2.3 Create User

*   **Endpoint**: `POST /api/users`
*   **Description**: Creates a new user.
*   **Authentication**: Required (Admin).
*   **Request Body**: `Omit<User, 'id' | 'createdDate' | 'updatedDate' | 'lastLoginDate'>` (Password is required for new user creation)
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string (email format)",
      "password": "string (min 8 characters)",
      "roles": "string (comma-separated, e.g., 'ROLE_USER,ROLE_EDITOR')",
      "jobTitle": "string (optional)",
      "accountNonExpired": "boolean (default: true)",
      "accountNonLocked": "boolean (default: true)",
      "credentialsNonExpired": "boolean (default: true)",
      "enabled": "boolean (default: true)"
    }
    ```
*   **Response Body (Success - 201 Created)**:
    ```json
    {
      "user": "User" // The newly created User object, see User Object Structure
    }
    ```
*   **Response Body (Error - 400 Bad Request)**: For validation errors.

#### 3.2.4 Update User

*   **Endpoint**: `PUT /api/users/{id}`
*   **Description**: Updates an existing user's information. Password updates should ideally be handled by the `change-password` endpoint or a dedicated admin password reset flow.
*   **Authentication**: Required (Admin or self, with restrictions for self-update).
*   **Path Parameters**:
    *   `id` (string): The ID of the user to update.
*   **Request Body**: `Partial<Omit<User, 'id' | 'createdDate' | 'updatedDate' | 'lastLoginDate' | 'password'>>`
    ```json
    {
      "firstName": "string (optional)",
      "lastName": "string (optional)",
      "email": "string (email format, optional)",
      "roles": "string (comma-separated, optional, admin only)",
      "jobTitle": "string (optional)",
      // Admin-only updatable fields:
      "accountNonExpired": "boolean (optional, admin only)",
      "accountNonLocked": "boolean (optional, admin only)",
      "credentialsNonExpired": "boolean (optional, admin only)",
      "enabled": "boolean (optional, admin only)"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "user": "User" // The updated User object, see User Object Structure
    }
    ```
*   **Response Body (Error - 400 Bad Request, 404 Not Found)**.

#### 3.2.5 Delete User

*   **Endpoint**: `DELETE /api/users/{id}`
*   **Description**: Deletes a user from the system.
*   **Authentication**: Required (Admin).
*   **Path Parameters**:
    *   `id` (string): The ID of the user to delete.
*   **Response Body (Success - 204 No Content)** or (200 OK with body):
    ```json
    {
      "success": true,
      "message": "User deleted successfully."
    }
    ```
*   **Response Body (Error - 404 Not Found)**.

#### 3.2.6 Get Unique Roles

*   **Endpoint**: `GET /api/roles/unique`
*   **Description**: Retrieves a list of all unique roles present in the system.
*   **Authentication**: Required.
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "roles": ["string"] // Array of unique role strings
    }
    ```

### 3.3 AI Services API

Endpoints utilizing Genkit for AI-powered features.

#### 3.3.1 Suggest User Roles

*   **Endpoint**: `POST /api/ai/suggest-roles`
*   **Description**: Suggests user roles based on a given job title.
*   **Authentication**: Required.
*   **Request Body**:
    ```json
    {
      "jobTitle": "string" // The job title of the user.
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "suggestedRoles": ["string"] // An array of suggested role strings.
    }
    ```
*   **Response Body (Error - 400 Bad Request, 500 Internal Server Error)**.

### 3.4 Audit Log API

Endpoints for accessing audit log data.

#### 3.4.1 Get Audit Logs

*   **Endpoint**: `GET /api/audit-logs`
*   **Description**: Fetches a paginated list of audit logs.
*   **Authentication**: Required (Admin).
*   **Query Parameters**:
    *   `page` (optional, number): Page number (default: 1).
    *   `limit` (optional, number): Logs per page (default: 10).
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "logs": ["AuditLog"], // Array of AuditLog objects, see AuditLog Object Structure
      "total": "number (total logs)",
      "currentPage": "number",
      "totalPages": "number"
    }
    ```

### 3.5 Notification API

Endpoints for accessing and managing user notifications.

#### 3.5.1 Get Notifications

*   **Endpoint**: `GET /api/notifications`
*   **Description**: Fetches notifications for the currently authenticated user.
*   **Authentication**: Required.
*   **Query Parameters (Optional)**:
    *   `page` (optional, number): Page number for pagination.
    *   `limit` (optional, number): Notifications per page.
    *   `status` (optional, string): "unread" or "all".
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "notifications": ["NotificationMessage"], // See NotificationMessage Object Structure
      "total": "number (total notifications matching filter)",
      "unreadCount": "number (total unread notifications for the user)"
    }
    ```

#### 3.5.2 Mark Notification as Read

*   **Endpoint**: `PATCH /api/notifications/{notificationId}/read`
*   **Description**: Marks a specific notification as read for the current user.
*   **Authentication**: Required.
*   **Path Parameters**:
    *   `notificationId` (string): The ID of the notification.
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "notification": "NotificationMessage" // The updated NotificationMessage object
    }
    ```
*   **Response Body (Error - 404 Not Found)**.

#### 3.5.3 Mark All Notifications as Read

*   **Endpoint**: `POST /api/notifications/mark-all-read`
*   **Description**: Marks all unread notifications for the current user as read.
*   **Authentication**: Required.
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "message": "All notifications marked as read.",
      "unreadCountAfter": 0
    }
    ```

#### 3.5.4 Clear All Notifications

*   **Endpoint**: `DELETE /api/notifications` (or `POST /api/notifications/clear-all`)
*   **Description**: Deletes all notifications for the current user.
*   **Authentication**: Required.
*   **Response Body (Success - 204 No Content)** or (200 OK with body):
    ```json
    {
      "success": true,
      "message": "All notifications cleared."
    }
    ```

### 3.6 Settings API

Endpoints for managing user-specific settings.

#### 3.6.1 Update Notification Preferences

*   **Endpoint**: `PUT /api/settings/notifications`
*   **Description**: Updates the current user's notification preferences.
*   **Authentication**: Required.
*   **Request Body**:
    ```json
    {
      "systemAlerts": "boolean",
      "newLogins": "boolean",
      "passwordChanges": "boolean",
      "roleUpdates": "boolean"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "preferences": { /* same structure as request body */ },
      "message": "Notification preferences updated successfully."
    }
    ```

#### 3.6.2 Update Language Preference

*   **Endpoint**: `PUT /api/settings/language`
*   **Description**: Updates the current user's language preference.
*   **Authentication**: Required.
*   **Request Body**:
    ```json
    {
      "language": "string" // e.g., "en", "es"
    }
    ```
*   **Response Body (Success - 200 OK)**:
    ```json
    {
      "language": "string",
      "message": "Language preference updated successfully."
    }
    ```

### 3.7 Support & Feedback API

Endpoints for handling user support requests and feedback.

#### 3.7.1 Submit Contact Support Request

*   **Endpoint**: `POST /api/support/contact`
*   **Description**: Submits a contact support request.
*   **Request Body (Content-Type: multipart/form-data if attachment is included, otherwise application/json)**:
    ```json
    {
      "name": "string",
      "email": "string (email format)",
      "subject": "string",
      "inquiryType": "string (e.g., 'technical_issue', 'billing_question')",
      "message": "string",
      "attachment": "file (optional)"
    }
    ```
*   **Response Body (Success - 201 Created)**:
    ```json
    {
      "success": true,
      "message": "Support request received. We will get back to you shortly.",
      "ticketId": "string (optional, if a ticketing system is used)"
    }
    ```
*   **Response Body (Error - 400 Bad Request)**.

#### 3.7.2 Submit Feedback

*   **Endpoint**: `POST /api/feedback`
*   **Description**: Submits user feedback.
*   **Request Body**:
    ```json
    {
      "feedbackType": "string (e.g., 'suggestion', 'bug_report')",
      "email": "string (email format, optional)",
      "subject": "string",
      "message": "string"
    }
    ```
*   **Response Body (Success - 201 Created)**:
    ```json
    {
      "success": true,
      "message": "Thank you for your feedback!"
    }
    ```
*   **Response Body (Error - 400 Bad Request)**.

## 4. Object Structures

Common data object structures referenced in API responses.

### 4.1 User Object

```typescript
{
  "id": "string (unique identifier)",
  "firstName": "string",
  "lastName": "string",
  "email": "string (email format)",
  // "password" field is never returned in API responses
  "roles": "string (comma-separated list of roles, e.g., 'ROLE_USER,ROLE_ADMIN')",
  "jobTitle": "string (optional)",
  "createdDate": "string (ISO 8601 datetime)",
  "updatedDate": "string (ISO 8601 datetime)",
  "lastLoginDate": "string (ISO 8601 datetime, optional, null if never logged in)",
  "accountNonExpired": "boolean",
  "accountNonLocked": "boolean",
  "credentialsNonExpired": "boolean",
  "enabled": "boolean (user account is active/disabled)"
}
```

### 4.2 AuditLog Object

```typescript
{
  "id": "string (unique identifier)",
  "timestamp": "string (ISO 8601 datetime)",
  "user": "string (user email or 'system')",
  "action": "string (e.g., 'LOGIN_SUCCESS', 'USER_UPDATE')",
  "details": "string (description of the action)",
  "entity": "string (e.g., 'User', 'Role', 'System')"
}
```

### 4.3 NotificationMessage Object

```typescript
{
  "id": "string (unique identifier)",
  "timestamp": "string (ISO 8601 datetime)",
  "title": "string",
  "message": "string",
  "read": "boolean",
  "type": "string (e.g., 'security', 'announcement', 'system', 'info')"
}
```

---

*This documentation should be updated as the backend API evolves. Ensure schemas are kept in sync with actual implementations.*

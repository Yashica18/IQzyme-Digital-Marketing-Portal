# Security Specification & Threat Model - IQzyme Firestore Database

This document details the security invariants, threat vector payloads, and verification tests targeting the IQzyme Firebase Firestore deployment.

## 1. Data Invariants & Access Control Policy

*   **User Profiles (`/users/{userId}`)**: 
    *   A user document can only be read or written if the requesting user's UID matches the document ID (`userId`).
    *   System roles (`role`) can only be modified by administrators or are initialized upon signup. Users are blocked from elevating their own roles.
*   **Contact Messages (`/contactMessages/{messageId}`)**:
    *   Any visitor can write a contact message.
    *   Only authorized administrators are allowed to read, update, or delete contact message documents.
*   **Consultation Requests (`/consultationRequests/{requestId}`)**:
    *   Any user can create a consultation request booking.
    *   A registered user can only read their own consultation bookings. The `userId` property must match their active authentication UID, or their email must match.
    *   Only administrators are authorized to update or delete consultation bookings.
*   **Newsletter Subscribers (`/newsletterSubscribers/{subscriberId}`)**:
    *   Subscribing is public (write access).
    *   Only administrators have read, update, or delete permissions.
*   **Blogs, Services, Courses, Testimonials (`/blogs/*`, `/services/*`, `/courses/*`, `/testimonials/*`)**:
    *   All regulatory posts, services, courses, and testimonials are publicly readable by anyone.
    *   Only verified administrators can create, update, or delete these records.

---

## 2. The "Dirty Dozen" Threat Vector Payloads

Below are twelve malicious payloads representing identity spoofing, state bypass, privilege escalation, value poisoning, and denial of wallet attacks.

### Payload 1: Privilege Escalation (User self-assigning "admin" role)
*   **Target Path**: `/users/attacker_uid`
*   **Operation**: `create` / `update`
*   **Payload**:
    ```json
    {
      "userId": "attacker_uid",
      "email": "attacker@spam.com",
      "displayName": "Malicious Actor",
      "role": "admin"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Users cannot set their own role to admin.

### Payload 2: Identity Spoofing (Writing user profile for another UID)
*   **Target Path**: `/users/victim_uid`
*   **Operation**: `create`
*   **Payload**:
    ```json
    {
      "userId": "victim_uid",
      "email": "victim@company.com",
      "displayName": "Innocent Victim",
      "role": "client"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Write blocked because request auth UID does not match target.

### Payload 3: Orphaned Reference (Creating a booking for non-existent user)
*   **Target Path**: `/consultationRequests/booking_99`
*   **Operation**: `create`
*   **Payload**:
    ```json
    {
      "userId": "non_existent_uid",
      "companyName": "Spoof Corp",
      "consultationDate": "2026-08-01",
      "timeSlot": "10:00 - 11:00",
      "serviceStream": "SUGAM",
      "clientEmail": "spoof@corp.com",
      "clientName": "Spoof",
      "status": "pending_confirmation",
      "createdAt": "SERVER_TIMESTAMP"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Creating requests for users that do not exist or mismatch active UID is forbidden.

### Payload 4: PII Data Harvest (Unauthorized reading of users' private emails)
*   **Target Path**: `/users/victim_uid`
*   **Operation**: `get`
*   **Request User**: `attacker_uid`
*   **Expected Result**: `PERMISSION_DENIED` - Users cannot read other users' profile documents.

### Payload 5: Unauthorized Booking Deletion
*   **Target Path**: `/consultationRequests/booking_01`
*   **Operation**: `delete`
*   **Request User**: `client_uid` (not Admin)
*   **Expected Result**: `PERMISSION_DENIED` - Clients can create/read bookings, but never delete them.

### Payload 6: Value Poisoning (Injecting huge junk string into ID field)
*   **Target Path**: `/newsletterSubscribers/INVALID_ID_JUNK_CHARACTERS_THAT_ARE_VERY_LONG_AND_EXCEED_THE_128_CHARACTER_MAXIMUM_LIMIT`
*   **Operation**: `create`
*   **Payload**:
    ```json
    {
      "email": "malicious@overflow.com",
      "createdAt": "SERVER_TIMESTAMP"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - ID failed `isValidId()` check.

### Payload 7: Client-Provided Spoofed Timestamp (Bypassing server validation)
*   **Target Path**: `/newsletterSubscribers/sub_1`
*   **Operation**: `create`
*   **Payload**:
    ```json
    {
      "email": "user@gmail.com",
      "createdAt": "2000-01-01T00:00:00.000Z"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - `createdAt` must match server-asserted `request.time`.

### Payload 8: Content Defacement (Anonymous user attempting to edit blog)
*   **Target Path**: `/blogs/blog_1`
*   **Operation**: `update`
*   **Request User**: Anonymous / Client
*   **Payload**:
    ```json
    {
      "title": "Hacked Blog post"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Only admins can modify blog content.

### Payload 9: Shadow Field Insertion in contactMessages
*   **Target Path**: `/contactMessages/msg_1`
*   **Operation**: `create`
*   **Payload**:
    ```json
    {
      "userId": "anonymous",
      "name": "Spammer",
      "email": "spam@web.com",
      "message": "Enquiry text",
      "createdAt": "SERVER_TIMESTAMP",
      "ghostField": "inject_malicious_data"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Key size strict matching prevents shadow fields.

### Payload 10: State Shortcut (Directly confirming a booking from client SDK)
*   **Target Path**: `/consultationRequests/booking_01`
*   **Operation**: `update`
*   **Request User**: `client_uid` (Author of booking)
*   **Payload**:
    ```json
    {
      "status": "confirmed"
    }
    ```
*   **Expected Result**: `PERMISSION_DENIED` - Only Admins can modify booking status.

### Payload 11: Spoofed Email Verification
*   **Target Path**: `/users/attacker_uid`
*   **Operation**: `create`
*   **Auth Token Email**: `admin@iqzyme.com` (But `email_verified` is `false`)
*   **Expected Result**: `PERMISSION_DENIED` - Must require `email_verified == true` for identity-sensitive data.

### Payload 12: Testimonial Fraud (Public write access to testimonials)
*   **Target Path**: `/testimonials/testimonial_1`
*   **Operation**: `create`
*   **Request User**: Unauthenticated Visitor
*   **Expected Result**: `PERMISSION_DENIED` - Creation restricted to authenticated admin users.

---

## 3. Test Runner Definition (firestore.rules.test.ts)

A sample implementation of the unit tests confirming complete protection of all collections in Phase 0.

```typescript
import { 
  initializeTestEnvironment, 
  RulesTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('IQzyme Firestore Rules Unit Tests', () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'iqzyme-test-project',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it('Payload 1: Should deny privilege escalation where a user sets their role to admin', async () => {
    const context = testEnv.authenticatedContext('attacker_uid');
    const db = context.firestore();
    const docRef = doc(db, 'users', 'attacker_uid');
    await assertFails(setDoc(docRef, {
      userId: 'attacker_uid',
      email: 'attacker@spam.com',
      displayName: 'Malicious Actor',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });

  it('Payload 2: Should deny a user creating a profile for another user', async () => {
    const context = testEnv.authenticatedContext('attacker_uid');
    const db = context.firestore();
    const docRef = doc(db, 'users', 'victim_uid');
    await assertFails(setDoc(docRef, {
      userId: 'victim_uid',
      email: 'victim@company.com',
      displayName: 'Innocent Victim',
      role: 'client'
    }));
  });

  it('Payload 4: Should deny unauthorized profile reading (PII Isolation)', async () => {
    const context = testEnv.authenticatedContext('attacker_uid');
    const db = context.firestore();
    const docRef = doc(db, 'users', 'victim_uid');
    await assertFails(getDoc(docRef));
  });
});
```

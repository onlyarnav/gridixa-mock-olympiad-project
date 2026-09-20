# Gridixa AI Mock Olympiad — API Contract

All Olympiad API endpoints require valid JWT authentication using the project's existing JWT validation middleware. Endpoints respond with JSON payloads.

---

## 1. Start Examination
Initializes a new examination session for the authenticated user, or recovers the existing one if active.

* **Endpoint**: `POST /api/olympiad/start`
* **Authentication**: Required (JWT Bearer Token)
* **Headers**: `Content-Type: application/json`
* **Response (New / Recovered Attempt)**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": {
        "attemptId": "a8b9c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d",
        "level": "CLASS_6_8",
        "questions": [
          {
            "id": "CLASS_6_8_Q001",
            "question": "What is the primary language of the web?",
            "options": [
              { "label": "A", "text": "Python" },
              { "label": "B", "text": "C++" },
              { "label": "C", "text": "JavaScript" },
              { "label": "D", "text": "Java" }
            ],
            "difficulty": "EASY",
            "subject": "Web Development"
          }
        ],
        "answers": {
          "CLASS_6_8_Q001": {
            "selectedOption": "C",
            "answeredAt": "2026-07-15T08:20:00.000Z"
          }
        },
        "startedAt": "2026-07-15T08:00:00.000Z",
        "expiresAt": "2026-07-15T09:00:00.000Z"
      }
    }
    ```
* **Error Responses**:
  * **Status Code**: `400 Bad Request` (e.g., User is in cooldown, or user has no configured academic level in MongoDB user profile)
    ```json
    {
      "success": false,
      "message": "Cannot start exam: 24-hour attempt cooldown is active."
    }
    ```
  * **Status Code**: `401 Unauthorized` (Invalid/missing JWT credentials)

---

## 2. Get Current Active Session
Retrieves the active examination session if one exists in Redis.

* **Endpoint**: `GET /api/olympiad/session`
* **Authentication**: Required (JWT Bearer Token)
* **Response (Active Session Exists)**:
  * **Status Code**: `200 OK`
  * **Payload**: Same as starting attempt payload.
* **Response (No Active Session)**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": null
    }
    ```

---

## 3. Autosave Answer
Saves or clears the chosen option for a specific question in the active exam session.

* **Endpoint**: `POST /api/olympiad/save`
* **Authentication**: Required (JWT Bearer Token)
* **Request Body**:
  ```json
  {
    "questionId": "CLASS_6_8_Q001",
    "selectedOption": "C"
  }
  ```
  * *Note: Pass `selectedOption: null` or `selectedOption: ""` to clear a previously selected answer choice.*
* **Response**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": {
        "attemptId": "a8b9c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d",
        "answers": {
          "CLASS_6_8_Q001": {
            "selectedOption": "C",
            "answeredAt": "2026-07-15T08:20:00.000Z"
          }
        }
      }
    }
    ```
* **Error Responses**:
  * **Status Code**: `400 Bad Request` (Invalid option label, empty questionId, or question is not part of the active examination set)
  * **Status Code**: `404 Not Found` (No active examination session found in Redis, or session has expired)

---

## 4. Get Remaining Time
Returns the exact number of seconds remaining in the active examination timer.

* **Endpoint**: `GET /api/olympiad/time`
* **Authentication**: Required (JWT Bearer Token)
* **Response**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": {
        "remainingSeconds": 3540
      }
    }
    ```
* **Error Responses**:
  * **Status Code**: `404 Not Found` (No active examination session found or expired)

---

## 5. Submit Examination
Submits the active examination, calculates scores, removes cached session keys from Redis, and logs a persistent 24-hour attempt cooldown.

* **Endpoint**: `POST /api/olympiad/submit`
* **Authentication**: Required (JWT Bearer Token)
* **Response**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": {
        "finalScore": 150,
        "correctAnswersCount": 40,
        "wrongAnswersCount": 10,
        "unansweredCount": 10
      }
    }
    ```
* **Error Responses**:
  * **Status Code**: `400 Bad Request` (Already submitted - atomic double-submission block, or no active session found)
  * **Status Code**: `503 Service Unavailable` (Redis or MongoDB connection lost)

---

## 6. Check Cooldown Status
Checks if the authenticated user is under a 24-hour examination cooldown block.

* **Endpoint**: `GET /api/olympiad/cooldown`
* **Authentication**: Required (JWT Bearer Token)
* **Response**:
  * **Status Code**: `200 OK`
  * **Payload**:
    ```json
    {
      "success": true,
      "data": {
        "inCooldown": true,
        "cooldownUntil": "2026-07-16T08:20:00.000Z"
      }
    }
    ```

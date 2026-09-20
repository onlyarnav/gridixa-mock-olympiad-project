# Gridixa AI Mock Olympiad — Deployment Checklist

This document details the configuration requirements, database migrations/indexes, environment settings, and startup order needed to deploy the Mock Olympiad module in a production environment.

---

## 1. Environment Variables

Ensure these environment variables are correctly populated in the hosting environments:

### Backend Configuration
| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Yes | - | Production MongoDB connection string. |
| `REDIS_URL` | Yes | `redis://127.0.0.1:6379` | Production Redis connection string. |
| `JWT_SECRET` | Yes | - | Secret key used to sign and verify user session tokens. |
| `PORT` | No | `5000` | Port the Express application listens on. |

### Frontend Configuration
| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000/api` | The base HTTP endpoint pointing to the backend routing API. |

---

## 2. Infrastructure Setup & Requirements

### Redis Setup
* **Version**: Redis 6.x or newer is recommended.
* **Keyspace Notification**: Eviction is automated using Redis native TTL values. No custom keyspace events are required.
* **Connectivity**: The server configures reconnection loops (`maxRetriesPerRequest: 3`). Ensure Redis is deployed inside the same Virtual Private Network (VPC) as the Express application to avoid high latency or connectivity blocks.

### MongoDB Setup
* **Version**: MongoDB 5.x or newer is recommended.
* **Indexes**: 
  * The `OlympiadCooldown` schema relies on queries matching `{ userId, cooldownUntil }`.
  * Ensure the following compound index is created to optimize lookup speed and prevent collection scans:
    ```javascript
    db.olympiadcooldowns.createIndex({ userId: 1, cooldownUntil: -1 })
    ```
  * Timestamps (createdAt, updatedAt) index is optionally recommended if analytics or reports are ever attached.

---

## 3. Startup & Boot Sequences

To prevent runtime crashes and ensure cache validity, respect the following order of operations during startup:

1. **Verify Redis & MongoDB Availability**:
   * The container cluster should boot Redis and MongoDB before launching backend containers.
2. **Build and Load Question Bank**:
   * The backend startup script compiles questions and validates integrity.
   * If a static JSON file is missing, duplicates question IDs, or fails disjoint sets validation, the server logs the syntax anomaly and exits immediately (`process.exit(1)`).
3. **Establish cache**:
   * Once validated, files are cached in-memory.
   * Disk IO is never performed during API runtime operations.
4. **Deploy Frontend Bundle**:
   * Build the Next.js target: `npm run build` inside `frontend/`.
   * Serve Next.js pages after API endpoints are fully active to prevent landing page API fetch failures.

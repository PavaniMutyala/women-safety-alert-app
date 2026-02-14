
# GuardiaAI - Architecture & Logic

## 1. System Architecture
- **Frontend**: React (SPA) with Tailwind CSS for mobile-responsive UI.
- **Backend (Proposed)**: Node.js Express Server for handling notifications and emergency logging.
- **AI Core**: Google Gemini API for:
  - **Live Audio Processing**: Real-time keyword and panic detection.
  - **Contextual Risk Analysis**: Route safety scoring based on multi-source data.
  - **Translation**: Multilingual accessibility.

## 2. Database Schema (MongoDB)
### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "phone": "string",
  "email": "string",
  "language": "string",
  "contacts": [
    { "name": "string", "phone": "string", "relation": "string" }
  ],
  "emergencyHistory": ["ObjectId"]
}
```

### Alerts Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "SOS|VOICE|BATTERY",
  "location": { "lat": "number", "lng": "number" },
  "audioClipUrl": "string",
  "status": "ACTIVE|RESOLVED",
  "createdAt": "date"
}
```

## 3. Key API Endpoints
- `POST /api/v1/sos/trigger`: Initiates emergency protocol.
- `GET /api/v1/safety/risk-score`: Fetches Gemini-calculated route safety.
- `POST /api/v1/user/contacts`: CRUD for trusted contacts.
- `PATCH /api/v1/sos/resolve/:id`: Marks an alert as safe.

## 4. Community Impact
- **Rural Accessibility**: Low-bandwidth mode reduces asset sizes and switches to SMS-only alerting if WebSocket fails.
- **Privacy**: End-to-end encryption for audio recordings and location pings. Data is auto-deleted after 48h unless tagged as evidence.
